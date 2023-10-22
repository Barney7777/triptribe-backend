import { BasePhotoDto } from './base-photo.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePhotoDto extends PartialType(BasePhotoDto) {}
