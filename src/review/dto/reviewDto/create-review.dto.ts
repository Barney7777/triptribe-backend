import { Exclude } from 'class-transformer';
import { CreatePhotoDto } from '../photoDto/create-photo.dto';
import { BaseReviewDto } from './base-review.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateReviewDto extends PartialType(BaseReviewDto) {
  @Exclude()
  photos: CreatePhotoDto[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  userId: string;
}
