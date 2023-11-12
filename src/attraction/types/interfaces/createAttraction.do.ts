import { UpdatePhotoDto } from '@/review/dto/photoDto/update-photo.dto';

export interface ICreateAttaraction {
  name?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  createdUserId: string;
  photos?: UpdatePhotoDto[];
}
