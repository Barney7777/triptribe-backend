import { IsString, IsEnum } from 'class-validator';
import { PhotoType } from '@/schema/photo.schema';

export class BasePhotoDto {
  @IsString()
  imageAlt: string;

  @IsString()
  imageUrl: string;

  @IsEnum(PhotoType)
  imageType: PhotoType;

  @IsString()
  uploadUserId: string;
}
