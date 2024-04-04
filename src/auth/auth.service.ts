import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserDocument } from '@/user/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { UserIdDto } from '@/user/dto/userId.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { QUEUE_PROCESS_REGISTER } from '@/common/constant/queue.constant';
import { NotFoundException } from '@nestjs/common';
import { EmailConsumer } from './consumers/email.consumer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schema/user.schema';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly emailConsumer: EmailConsumer,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectQueue('send-email') private sendEmailQueue: Queue
  ) {}

  async register(registerData: AuthRegisterDto, hostname) {
    const user = await this.userService.create(registerData);
    const userId = user._id;
    // queue task: send validation email when user register successfull
    await this.sendEmailQueue.add(
      QUEUE_PROCESS_REGISTER,
      {
        userId,
        hostname,
      },
      { delay: 100 }
    );
    return user;
  }

  async login(user: UserDocument) {
    const userId = String(user._id);
    const emailToken = user.emailToken;
    if (emailToken) {
      return { message: 'Unverified' };
    }
    const accessToken = await this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId);
    return {
      message: 'login success',
      accessToken,
      refreshToken,
    };
  }

  //generate accessToken
  async generateAccessToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    const ACCESS_TOKEN_TIME = '12h';
    return this.jwtService.signAsync(payload, { expiresIn: ACCESS_TOKEN_TIME });
  }

  //generate refreshToken
  async generateRefreshToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    const REFRESH_TOKEN_TIME = '1d';
    return this.jwtService.signAsync(payload, { expiresIn: REFRESH_TOKEN_TIME });
  }

  //use refreshToken to get a new accessToken
  async refreshToken(refreshToken: string) {
    //verify refreshToken
    if (!refreshToken) {
      return { message: 'Refresh token miss' };
    }

    // must Assertion sub and exp exist in decodedToken object
    const decodedToken: { sub: string; exp: number } | null = this.jwtService.decode(
      refreshToken
    ) as {
      sub: string;
      exp: number;
    } | null;

    if (!decodedToken) {
      return { message: 'Invalid Refresh Token' };
    }

    // //if refresh_token expired, return expired
    // if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
    //   return { message: 'Refresh Token is expired' };
    // }

    // using dayjs, if refresh_token expired, return expired
    // get expireTime
    const expirationTime = dayjs.unix(decodedToken.exp);
    // get currentTime
    const currentTime = dayjs();

    // dayjs isBefore API to compare
    if (expirationTime.isBefore(currentTime)) {
      return { message: 'Refresh Token is expired' };
    }

    // if not expired, find userId from 'sub', then find user
    const userId = decodedToken.sub;

    const foundUser = await this.userService.findOne(userId);

    //if user not exist ,return fake Token
    if (!foundUser) {
      return { message: 'Fake Token' };
    }

    //if user exist, generate a new accessToken and return
    const accessToken = await this.generateAccessToken(String(userId));

    return { accessToken };
  }

  async resetPassword(userId: UserIdDto['_id'], newPassword: ResetPasswordDto) {
    const userIdToString = String(userId);
    const user = await this.userService.findOne(userIdToString);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const editedUser = await this.userService.updatePassword(userId, newPassword);
    return editedUser;
  }

  async verifyEmail(token) {
    const decodedData = await this.decodeEmailToken(token);
    const email = decodedData.email;
    const user = await this.userModel.findOne({ email }).exec();
    if (decodedData.issuedAt === undefined || decodedData.expireTime === undefined) {
      throw new Error('Invalid token data');
    }
    const expireTime = decodedData.expireTime;
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const databaseToken = user?.emailToken;

    if (!user) {
      return { message: 'User not found' };
    }

    if (!user.emailToken) {
      return { message: 'Email token not found' };
    }

    if (token != databaseToken) {
      return { message: 'illegal token' };
    }

    if (currentTimestampInSeconds > expireTime) {
      return { message: 'expired token' };
    } else {
      await this.deleteEmailToken(user._id);
      return { message: 'Validated' };
    }
  }

  async deleteEmailToken(userId: UserIdDto['_id']): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $unset: { emailToken: 1 } }).exec();
  }

  async decodeEmailToken(token: string) {
    const decodedToken: { sub: string; exp: number; iat: number } | null = this.jwtService.decode(
      token
    ) as {
      sub: string;
      exp: number;
      iat: number;
    } | null;
    const email = decodedToken?.sub as string;
    const issuedAt = decodedToken?.iat;
    const expireTime = decodedToken?.exp;
    return { email, issuedAt, expireTime };
  }

  async refreshEmailToken(token: string, hostname): Promise<string> {
    const decodedata = await this.decodeEmailToken(token);
    console.log('decodedata', decodedata);
    const email = decodedata.email;
    console.log('ResendEmail', email);
    const payload = { sub: email, iat: Math.floor(Date.now() / 1000) };
    const EMAIL_TOKEN_TIME = '7d';
    const newEmailToken = await this.jwtService.signAsync(payload, { expiresIn: EMAIL_TOKEN_TIME });
    const user = await this.userModel
      .findOneAndUpdate({ email }, { emailToken: newEmailToken }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userId = await this.userModel.findOne({ email }).exec();

    await this.sendEmailQueue.add(
      QUEUE_PROCESS_REGISTER,
      {
        userId,
        hostname,
      },
      { delay: 100 }
    );
    return newEmailToken;
  }

  /**
   * @summary send email based on email
   * @param email
   * @param hostname
   */
  async resendEmail(email: string, hostname: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('User not found');

    const payload = { sub: email, iat: Math.floor(Date.now() / 1000) };
    const EMAIL_TOKEN_TIME = '7d';
    const newEmailToken = await this.jwtService.signAsync(payload, { expiresIn: EMAIL_TOKEN_TIME });
    const updateUser = await this.userModel
      .findOneAndUpdate({ email }, { emailToken: newEmailToken }, { new: true })
      .exec();
    console.log(updateUser);
    await this.sendEmailQueue.add(
      QUEUE_PROCESS_REGISTER,
      {
        userId: updateUser,
        hostname,
      },
      { delay: 100 }
    );
  }
}
