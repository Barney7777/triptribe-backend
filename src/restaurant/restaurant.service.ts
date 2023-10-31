import { Model } from 'mongoose';
import { Multer } from 'multer';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileUploadService } from '@/file/file.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './schema/restaurant.schema';
import { PhotoType } from '@/schema/photo.schema';
@Injectable()
export class RestaurantService {
  private currentUserId;

  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    private readonly fileUploadService: FileUploadService
  ) {
    this.currentUserId = 'asdzxc123asdd12';
  }

  async findAll(): Promise<Restaurant[]> {
    return await this.restaurantModel.find().exec();
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new NotFoundException('this restaurant does not exist');
    }
    return restaurant;
  }

  async create(
    createRestaurantDto: CreateRestaurantDto,
    files: Multer.File[]
  ): Promise<Restaurant> {
    if (!files) {
      const restaurant = {
        ...createRestaurantDto,
        createdUserId: this.currentUserId,
      };
      const createdRestaurant = new this.restaurantModel(restaurant);
      return await createdRestaurant.save();
    }

    const results = await this.fileUploadService.uploadPhoto(files, PhotoType.RESTAURANT);
    const photos = results.map((photo) => photo.data);

    const restaurant = {
      ...createRestaurantDto,
      photos,
      createdUserId: this.currentUserId,
    };
    const createdRestaurant = new this.restaurantModel(restaurant);
    return await createdRestaurant.save();
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    files: Multer.File[]
  ): Promise<Restaurant> {
    const { photos: currentPhotos } = await this.verifyRestaurant(id, this.currentUserId);

    const restPhotos = currentPhotos.filter(
      (photo) => updateRestaurantDto.photos?.some((p) => p.imageUrl === photo.imageUrl)
    );

    if (!files) {
      const updatedDto = { ...updateRestaurantDto, photos: restPhotos };
      const updatedRestaurant = await this.restaurantModel
        .findByIdAndUpdate(id, updatedDto, { new: true })
        .exec();
      if (!updatedRestaurant) {
        throw new NotFoundException('this restaurant does not exist');
      }
      return updatedRestaurant;
    }

    // update photos if adding new
    const results = await this.fileUploadService.uploadPhoto(files, PhotoType.RESTAURANT);
    const photos = results.map((photo) => photo.data);
    // TODO: update photos if photos order change
    const newPhotos = [...restPhotos, ...photos];
    const updatedDto = { ...updateRestaurantDto, photos: newPhotos };

    const updatedRestaurant = await this.restaurantModel
      .findByIdAndUpdate(id, updatedDto, { new: true })
      .exec();
    if (!updatedRestaurant) {
      throw new NotFoundException('this restaurant does not exist');
    }
    return updatedRestaurant;
  }

  // verify if editor is the creator of the restaurant
  async verifyRestaurant(id: string, userId: string) {
    const restaurant = await this.findOne(id);
    if (userId.toString() !== restaurant.createdUserId.toString()) {
      throw new ForbiddenException('You have no permission to access this resource!');
    }
    return restaurant;
  }
}
