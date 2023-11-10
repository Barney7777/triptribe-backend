import { PhotoType } from '@/schema/photo.schema';
import { IsString, IsEnum } from 'class-validator';

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
