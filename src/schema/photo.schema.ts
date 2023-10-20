import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

enum PhotoType {
  ATTRACTION = 'attraction',
  RESTAURANT = 'restaurant',
  USER = 'user',
  REVIEW = 'review',
}

export type PhotoDocument = mongoose.HydratedDocument<Photo>;

@Schema({ _id: false })
export class Photo {
  @Prop({ required: true })
  imageAlt: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true, enum: PhotoType, default: PhotoType.USER })
  imageType: PhotoType;

  @Prop({ required: true, type: mongoose.Types.ObjectId })
  uploadUserId: mongoose.Types.ObjectId;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
