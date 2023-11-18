import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserDocument } from '@/user/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDto } from './dto/auth-register.dto';
import dayjs from 'dayjs';
import { EditPasswordDto } from './dto/edit-password.dto';
import { UserIdDto } from '@/user/dto/userId.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) { }

  async register(registerData: AuthRegisterDto) {
    const user = await this.userService.create(registerData);
    return user;
  }

  async login(user: UserDocument) {
    const userId = String(user._id);
    const accessToken = await this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId);

    return {
      message: 'login success',
      accessToken,
      refreshToken,
    };
  }

  getMeInfo(user: UserDocument) {
    return `This action getMeInfo, email is ${user.email}`;
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

  async editPassword(userId: UserIdDto['_id'], newPassword: EditPasswordDto) {
    const userIdToString = String(userId)
    const user = await this.userService.findOne(userIdToString)
    if (!user) {
      throw new BadRequestException("User not found")
    }
    const editedUser = await this.userService.updatePassword(userId, newPassword);
    return editedUser;

  }
}
