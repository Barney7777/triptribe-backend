import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Photo, PhotoSchema } from './photo.schema';
import { Attraction } from './attraction.schema';
import { Restaurant } from './restaurant.schema';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  BUSINESS_OWNER = 'business_owner',
}

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true })
  nickname: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop()
  description: string;

  @Prop()
  authToken: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Attraction' }] })
  savedAttractions: Attraction[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Restaurant' }] })
  savedRestaurants: Restaurant[];

  @Prop({ type: PhotoSchema, default: [] })
  userAvatar: Photo;
}

export const UserSchema = SchemaFactory.createForClass(User);
