import { Model } from 'mongoose';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('user not existed');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new ConflictException('user existed');
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async createUser({ email, password }: { email: string, password: string }): Promise<User> {
    const createdUser = await this.userModel.create({ email, password });
    console.log(createdUser);

    return createdUser.toObject()
  }

  async findOneByEmail({ email }: { email: string }): Promise<User | null> {
    const user = await this.userModel.findOne({ email })
    return user
  }
  async updateToken({ _id, token }) {
    await this.userModel.updateOne({ _id }, { token })
  }
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }
}
