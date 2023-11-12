import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attraction } from './schema/attraction.schema';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { FileUploadService } from '@/file/file.service';
import { PhotoType } from '@/schema/photo.schema';
import { ICreateAttaraction } from './types/interfaces/createAttraction.do';
import { UserIdDto } from '@/user/dto/userId.dto';
import { FileUploadDto } from '@/file/dto/file-upload.dto';

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
    if (files.length === 0) {
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
}
