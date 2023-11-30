import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import * as mongoose from 'mongoose';
import { Attraction } from '@/attraction/schema/attraction.schema';
import { Restaurant } from '@/restaurant/schema/restaurant.schema';
import { Photo, PhotoSchema } from '@/schema/photo.schema';
import { Field, ID, ObjectType } from '@nestjs/graphql';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  BUSINESS_OWNER = 'business_owner',
}

export type UserDocument = mongoose.HydratedDocument<User>;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
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

  @Field()
  @Prop({ unique: true })
  nickname: string;

  @Field({ nullable: true })
  @Prop()
  firstName: string;

  @Field({ nullable: true })
  @Prop()
  lastName: string;

  @Field()
  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Field({ nullable: true })
  @Prop()
  description: string;

  // @Prop()
  // authToken: string;
  @Field(() => [ID], { nullable: true })
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Attraction' }] })
  savedAttractions: Attraction[];

  @Field(() => [ID], { nullable: true })
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Restaurant' }] })
  savedRestaurants: Restaurant[];

  @Field(() => [Photo])
  @Prop({ type: [PhotoSchema], default: [] })
  userAvatar: Photo;
}

export const UserSchema = SchemaFactory.createForClass(User);
