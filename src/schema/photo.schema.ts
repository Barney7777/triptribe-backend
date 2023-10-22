import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export enum PhotoType {
  ATTRACTION = 'Attraction',
  RESTAURANT = 'Restaurant',
  USER = 'User',
  REVIEW = 'Review',
}

export type PhotoDocument = mongoose.HydratedDocument<Photo>;

@Schema()
export class Photo {
  @Prop({ required: true })
  imageAlt: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true, enum: PhotoType, default: PhotoType.USER })
  imageType: PhotoType;

  @Prop({ required: true, type: mongoose.Types.ObjectId })
  uploadUserId: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
