import { BaseAttractionDto } from './base-attraction.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePhotoDto } from '@/file/dto/create-photo.dto';
export class UpdateAttractionDto extends PartialType(BaseAttractionDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePhotoDto)
  photos?: CreatePhotoDto[];
}
