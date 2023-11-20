import { UpdatePhotoDto } from '@/review/dto/photoDto/update-photo.dto';

export interface IReview {
  title?: string;
  description?: string;
  rating?: number;
  userId: string;
  placeId?: string;
  photos?: UpdatePhotoDto[];
  placeType?: string;
}
