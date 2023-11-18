import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Photo, PhotoSchema } from '@/schema/photo.schema';
import { BusinessTime, BusinessTimeSchema } from '@/schema/businessTime.schema';
import { Address, AddressSchema } from '@/schema/address.schema';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

export type RestaurantDocument = mongoose.HydratedDocument<Restaurant>;

@ObjectType()
@Schema({ timestamps: true })
export class Restaurant {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field({ nullable: true })
  @Prop()
  website?: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Field()
  @Prop({ required: true })
  phone: string;

  @Field(() => BusinessTime, { nullable: true })
  @Prop({
    _id: false,
    type: {
      Monday: BusinessTimeSchema,
      Tuesday: BusinessTimeSchema,
      Wednesday: BusinessTimeSchema,
      Thursday: BusinessTimeSchema,
      Friday: BusinessTimeSchema,
      Saturday: BusinessTimeSchema,
      Sunday: BusinessTimeSchema,
    },
    default: {},
  })
  openHours?: {
    Monday: BusinessTime;
    Tuesday: BusinessTime;
    Wednesday: BusinessTime;
    Thursday: BusinessTime;
    Friday: BusinessTime;
    Saturday: BusinessTime;
    Sunday: BusinessTime;
  };

  @Field(() => Address)
  @Prop({ type: AddressSchema, default: {} })
  address: Address;

  @Field(() => Float, { nullable: true })
  @Prop()
  overAllRating?: number;

  @Field(() => [Photo])
  @Prop({ type: [PhotoSchema], default: [] })
  photos: Photo[];

  @Field(() => ID)
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  createdUserId: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
