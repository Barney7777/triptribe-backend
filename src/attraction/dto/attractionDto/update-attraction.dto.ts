import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { BaseAttractionDto } from './base-attraction.dto';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { UpdatePhotoDto } from '../photoDto/update-photo.dto';

export class UpdateAttractionDto extends PartialType(BaseAttractionDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePhotoDto)
  photos: UpdatePhotoDto[];
}
