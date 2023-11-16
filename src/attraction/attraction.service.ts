import { Model } from 'mongoose';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { Attraction } from '@/schema/attraction.schema';
import { ICreateAttaraction } from './types/interfaces/createAttraction.do';
import { UserIdDto } from '@/user/dto/userId.dto';
import { CreateAttractionDto } from './dto/attractionDto/create-attraction.dto';
import { FileUploadDto } from '@/file/dto/file-upload.dto';
import { FileUploadService } from '@/file/file.service';
import { UpdateAttractionDto } from './dto/attractionDto/update-attraction.dto';
import { UpdatePhotoDto } from './dto/photoDto/update-photo.dto';
import { PhotoType } from '@/schema/photo.schema';
import { isValidObjectId } from 'mongoose';
import { QueryAttractionDto } from '@/attraction/dto/attractionDto/query-attraction.dto';


interface SaveToDatabase {
  name?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  // photos:CreatePhotoDto[];
  createdUserId: string;
  overAllRating: number;
}

@Injectable()
export class AttractionService {
  constructor(
    @InjectModel(Attraction.name) private attractionModel: Model<Attraction>,
    private uploadfileService: FileUploadService
  ) {}

  async findOne(id: string): Promise<Attraction> {
    const attraction = await this.attractionModel.findById(id).exec();
    if (!attraction) {
      throw new NotFoundException('this attraction does not exist');
    }
    return attraction;
  }

  async findAll(): Promise<Attraction[]> {
    return await this.attractionModel.find().exec();
  }

  async create(
    userId: UserIdDto['_id'],
    attractionDto: CreateAttractionDto,
    files: FileUploadDto[]
  ): Promise<Attraction> {
    if (!files) {
      const newAttraction: ICreateAttaraction = {
        ...attractionDto,
        createdUserId: userId,
        photos: [],
      };
      const createdAttraction = await this.attractionModel.create(newAttraction);
      return createdAttraction;
    }
    const results = await this.uploadfileService.uploadPhoto(userId, files, PhotoType.ATTRACTION);
    const photos = results.filter((result) => result.success).map((photo) => photo.data);
    const newAttraction: ICreateAttaraction = { ...attractionDto, createdUserId: userId, photos };
    const createdAttraction = await this.attractionModel.create(newAttraction);
    return createdAttraction;
  }

  async uploadPhoto(
    userId: UserIdDto['_id'],
    files: FileUploadDto[],
  ) {
    if (files.length === 0) {
      return [];
    }

    const uploadResult = await this.uploadfileService.uploadPhoto(
      userId,
      files,
      PhotoType.ATTRACTION
    );

    if (!uploadResult || !Array.isArray(uploadResult)) {
      throw new BadRequestException('Upload failed, no results returned.');
    }

    const uploadPic = uploadResult.map((photo) => ({
      imageUrl: photo.data.imageUrl,
      imageType: PhotoType.ATTRACTION,
      imageAlt: photo.data.imageAlt,
      uploadUserId: photo.data.uploadUserId,
    }));
    return uploadPic;
  }

  async updateAttraction(
    id: QueryAttractionDto['id'],
    files: FileUploadDto[],
    updateAttractionDto: UpdateAttractionDto,
    userId: UserIdDto['_id']
  ): Promise<Attraction> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Provided _id is not a valid MongoDB ObjectId');
    }

    const current_userId = userId;
    const attractionData = await this.findOneFromMe(id, current_userId);
    const previousPhotos  = attractionData?.photos;
    const currentPhotos = updateAttractionDto.photos || [];

    const deletePhotos = previousPhotos?.filter((photo) => {
      return !currentPhotos.some(
        (currentPhoto) => currentPhoto.imageUrl?.toString() === photo.imageUrl.toString()
      );
    });

    if (deletePhotos !== undefined && deletePhotos?.length > 0) {
      console.log('deletePhotos', deletePhotos);
      // TODO!!! if deletePhoto array exist,call function to delete photo
    }

    let newPicArray;
    try {
      newPicArray = (await this.uploadPhoto(
        current_userId,
        files as any,
      )) as UpdatePhotoDto[];
    } catch (error) {
      throw error;
    }
    if (updateAttractionDto.photos) {
      updateAttractionDto.photos.push(...newPicArray);
    } else {
      updateAttractionDto.photos = newPicArray;
    }
    const dataToUpdate = { ...updateAttractionDto, userId: current_userId };
    try {
      const updatedAttraction = await this.attractionModel
        .findByIdAndUpdate(id, dataToUpdate, { new: true })
        .exec();
      return updatedAttraction as Attraction;
    } catch (error) {
      throw new BadRequestException('Update operation failed');
    }
  }

  
  async findOneFromMe(attractionId: string, current_userId: string) {
    // find userId relate to review and compare with current userId
    const attractionData = await this.findOne(attractionId);
    const userId = attractionData?.createdUserId;
    // if userId not match, no permission to update
    if (current_userId.toString() !== userId?.toString()) {
      throw new ForbiddenException('You have no permission to access this resource!');
    }
    return attractionData;
  }

  async remove(id: QueryAttractionDto['id'], userId: UserIdDto['_id']) {
    await this.findOneFromMe(id, userId);

    const review = await this.attractionModel.findByIdAndDelete(id).exec();
    return review;
  }
}
