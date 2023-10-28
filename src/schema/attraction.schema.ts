import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Photo, PhotoSchema } from './photo.schema';
import { BusinessTime, BusinessTimeSchema } from './businessTime.schema';
import { Address, AddressSchema } from './address.schema';
import { User } from './user.schema';

export type AttractionDocument = mongoose.HydratedDocument<Attraction>;

@Schema({ timestamps: true })
export class Attraction {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  website: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

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
  openHours: {
    Monday: BusinessTime;
    Tuesday: BusinessTime;
    Wednesday: BusinessTime;
    Thursday: BusinessTime;
    Friday: BusinessTime;
    Saturday: BusinessTime;
    Sunday: BusinessTime;
  };

  @Prop({ type: AddressSchema, default: {} })
  address: Address;

  @Prop({ required: true })
  overAllRating: number;

  @Prop({ type: [PhotoSchema], default: [] })
  photos: Photo[];

  @Prop({ required: true, type: mongoose.Types.ObjectId })
  createdUserId: mongoose.Types.ObjectId;
}

export const AttractionSchema = SchemaFactory.createForClass(Attraction);
