import { UpdatePhotoDto } from '@/review/dto/photoDto/update-photo.dto';

export interface Ireview {
  title?: string;
  description?: string;
  rating?: number;
  userId: string;
  placeId?: string;
  photos?: UpdatePhotoDto[];
  placeType?: string;
}
