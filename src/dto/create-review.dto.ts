import { Transform, Type } from 'class-transformer';
import { CreatePhotoDto } from './create-photo.dto';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum PlaceType {
  ATTRACTION = 'Attraction',
  RESTAURANT = 'Restaurant',
}

export class CreateReviewDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePhotoDto)
  photos: CreatePhotoDto[];

  @IsDate()
  @Transform(({ value }) => new Date(value))
  createdAt: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  updatedAt: Date;

  @IsMongoId()
  userId: string;

  //need to find out the whether placeId is attraction or restaurant in service
  @IsMongoId()
  placeId: string;

  @IsEnum(PlaceType)
  placeType: string;
}
