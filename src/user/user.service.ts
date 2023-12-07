import { Model } from 'mongoose';
import {
  // BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Restaurant } from '@/restaurant/schema/restaurant.schema';
import { Attraction } from '@/attraction/schema/attraction.schema';
import { SavePlaceDto } from './dto/save-place.dto';
import { EditPasswordDto } from '@/auth/dto/edit-password.dto';

interface CurrentUser {
  _id: string;
  savedAttractions?: string[];
  savedRestaurants?: string[];
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    @InjectModel(Attraction.name) private attractionModel: Model<Attraction>
  ) {}

  getMe(currentUser): User {
    return currentUser;
  }

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

  async addSavedPlace(currentUser: CurrentUser, savePlaceDto: SavePlaceDto): Promise<void> {
    const user = currentUser;
    let place;

    user.savedRestaurants = user.savedRestaurants || [];
    user.savedAttractions = user.savedAttractions || [];
    if (
      user.savedAttractions.includes(savePlaceDto.placeId) ||
      user.savedRestaurants.includes(savePlaceDto.placeId)
    ) {
      return;
    }

    if (savePlaceDto.placeType === 'Restaurant') {
      place = await this.restaurantModel.findById(savePlaceDto.placeId);
      if (!place) {
        throw new NotFoundException('Restaurant not found');
      }
      const newSavedList = [...user.savedRestaurants];
      newSavedList.push(place._id);
      const newUserData = { savedRestaurants: newSavedList };
      await this.userModel.findByIdAndUpdate(user['_id'], newUserData, { new: true }).exec();
      return;
    } else if (savePlaceDto.placeType === 'Attraction') {
      place = await this.attractionModel.findById(savePlaceDto.placeId);
      if (!place) {
        throw new NotFoundException('Attraction not found');
      }
      const newSavedList = [...user.savedAttractions];
      newSavedList.push(place._id);
      const newUserData = { savedAttractions: newSavedList };
      await this.userModel.findByIdAndUpdate(user['_id'], newUserData, { new: true }).exec();
      return;
    }
  }

  // async deleteSavedPlace(
  //   userId: string,
  //   savePlaceDto: SavePlaceDto
  // ): Promise<{ savedRestaurants: Restaurant[] } | { savedAttractions: Attraction[] } | undefined> {
  //   let place;

  //   if (savePlaceDto.placeType === 'Restaurant') {
  //     place = await this.restaurantModel.findById(savePlaceDto.placeId);
  //   } else if (savePlaceDto.placeType === 'Attraction') {
  //     place = await this.attractionModel.findById(savePlaceDto.placeId);
  //   }

  //   if (!place) {
  //     throw new BadRequestException('Place not found');
  //   }

  //   const user = await this.userModel.findById(userId);
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }

  //   if (savePlaceDto.placeType === 'Restaurant') {
  //     const index = user.savedRestaurants.indexOf(place._id);
  //     if (index > -1) {
  //       user.savedRestaurants.splice(index, 1);
  //       await user.save();
  //       return { savedRestaurants: user.savedRestaurants };
  //     }
  //   } else if (savePlaceDto.placeType === 'Attraction') {
  //     const index = user.savedAttractions.indexOf(place._id);
  //     if (index > -1) {
  //       user.savedAttractions.splice(index, 1);
  //       await user.save();
  //       return { savedAttractions: user.savedAttractions };
  //     }
  //   }
  // }

  async updatePassword(userId: string, newPassword: EditPasswordDto) {
    const { newPassword: checkedNewpassword } = newPassword;
    const res = await this.userModel.updateOne(
      { _id: userId },
      { $set: { password: checkedNewpassword } },
      { new: true }
    );
    return res;
  }
}
