import { PartialType } from '@nestjs/mapped-types';
import { BaseReviewDto } from './base-review.dto';
import { CreatePhotoDto } from '@/file/dto/create-photo.dto';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

export class UpdateReviewDto extends PartialType(BaseReviewDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePhotoDto)
  photos?: CreatePhotoDto[];
}
