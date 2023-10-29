// just for test, will change to Jess's final schema file when need
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import * as mongoose from 'mongoose';
import { Attraction } from '@/schema/attraction.schema';
import { Restaurant } from '@/restaurant/schema/restaurant.schema';

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

  @Prop({
    required: true,
    select: false,
    //bcrypt secure password
    set(val) {
      return val ? hashSync(val, 10) : val;
    },
  })
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

  // @Prop({ type: PhotoSchema, default: [] })
  // userAvatar: Photo;
}

export const UserSchema = SchemaFactory.createForClass(User);
