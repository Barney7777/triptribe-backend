import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';

export enum PlaceType {
  ATTRACTION = 'Attraction',
  RESTAURANT = 'Restaurant',
}
export class BaseReviewDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => BasePhotoDto)
  // photos: BasePhotoDto[];

  @IsDate()
  @Transform(({ value }) => new Date(value))
  createdAt: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  updatedAt: Date;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  placeId: string;

  @IsEnum(PlaceType)
  placeType: string;
}
