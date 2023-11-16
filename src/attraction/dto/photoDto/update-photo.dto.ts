import { IsMongoId } from 'class-validator';
import { BasePhotoDto } from './base-photo.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePhotoDto extends PartialType(BasePhotoDto) {
  @IsMongoId()
  _id: string;
}