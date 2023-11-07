import { Model } from 'mongoose';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('user not existed');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    // check if user already existed
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new ConflictException('user existed');
    }

    // generate default nickname
    const nicknameArray = createUserDto.email?.split('@') as string[];
    let nickname = nicknameArray[0];

    // check if duplicate nickname exist
    const sameNicknameUser = await this.userModel.find({ nickname: nickname });

    // if duplicate nickname exist
    if (sameNicknameUser.length > 0) {
      // check if similar nickname exist
      const similarNicknameUser = await this.userModel.find({
        nickname: { $regex: `^${nickname}#` },
      });

      // assign number to nickname for nickname unique
      const number = similarNicknameUser.length + 1;
      nickname = `${nickname}#${number}`;
    }

    // put nickname into createUserData
    const createUserData = { ...createUserDto, nickname };
    const createdUser = new this.userModel(createUserData);
    return createdUser.save();
  }
}
