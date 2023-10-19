import { IsString, IsEnum } from 'class-validator';

export enum ImageType {
  ATTRACTION = 'Attraction',
  RESTAURANT = 'Restaurant',
  USER = 'User',
  REVIEW = 'Review',
}
export class CreatePhotoDto {
  @IsString()
  image_alt: string;

  @IsString()
  image_url: string;

  @IsEnum(ImageType)
  imageType: ImageType;

  @IsString()
  uploadUserId: string;
}
