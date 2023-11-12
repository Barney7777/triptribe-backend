import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { BaseReviewDto } from './base-review.dto';
import { UpdatePhotoDto } from '../photoDto/update-photo.dto';

export class UpdateReviewDto extends PartialType(BaseReviewDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePhotoDto)
  photos: UpdatePhotoDto[];

  //"placeId" "placeType" can not be updated
  // So, take "placeId" "placeType" Exclude from object then use rest data to update
  @Exclude()
  placeId: string;

  @Exclude()
  placeType: string;

  @Exclude()
  userId: string;
}
