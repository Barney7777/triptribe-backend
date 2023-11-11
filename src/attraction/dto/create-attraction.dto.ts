import { Exclude, Type } from 'class-transformer';
import { BaseAttractionDto } from './base-attraction.dto';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoDto } from '@/file/dto/create-photo.dto';

export class CreateAttractionDto extends PartialType(BaseAttractionDto) {

  @Exclude()
  photos: CreatePhotoDto[];

  @Exclude()
  createdUserId: string;
}
