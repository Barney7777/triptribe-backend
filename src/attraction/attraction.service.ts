import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attraction } from './schema/attraction.schema';

@Injectable()
export class AttractionService {
  constructor(@InjectModel(Attraction.name) private attractionModel: Model<Attraction>) {}

  async findOne(id: string): Promise<Attraction> {
    const attraction = await this.attractionModel.findById(id).exec();
    if (!attraction) {
      throw new NotFoundException('attraction not existed');
    }
    return attraction;
  }

  async findAll(): Promise<Attraction[]> {
    return await this.attractionModel.find().exec();
  }
}
