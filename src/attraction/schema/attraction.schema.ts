import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Photo, PhotoSchema } from '@/schema/photo.schema';
import { BusinessTime, BusinessTimeSchema } from '@/schema/businessTime.schema';
import { Address, AddressSchema } from '@/schema/address.schema';

export type AttractionDocument = mongoose.HydratedDocument<Attraction>;

enum TypeEnum {
  SIGHT_AND_LANDMARKS = 'Sight & landmarks',
  NATURE_AND_PARKS = 'Nature & Parks',
  MUSEUMS = 'Museums',
  FUN_AND_GAMES = 'Fun & Games',
  NIGHTLIFE = 'Nightlife',
}

enum DurationEnum {
  UP_TO_ONE_HOUR = 'Up to 1 hour',
  ONE_TO_FOUR_HOURS = '1 to 4 hours',
  FOUR_HOURS_TO_ONE_DAY = '4 hours to 1 day',
}

@Schema({ _id: false })
class TagsType {
  @Prop({ type: [String], enum: Object.values(TypeEnum) })
  types: TypeEnum[];

  @Prop({ type: [String], enum: Object.values(DurationEnum) })
  durations: DurationEnum[];

  @Prop({ type: Number, default: 0 })
  cost: number;
}
@Schema({ timestamps: true })
export class Attraction {
  _id: string;

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

  @Prop()
  overAllRating: number;

  @Prop({ type: [PhotoSchema], default: [] })
  photos: Photo[];

  @Prop({ required: true, type: mongoose.Types.ObjectId })
  createdUserId: mongoose.Types.ObjectId;

  @Prop({ type: TagsType, default: {} })
  tags: TagsType;
}

export const AttractionSchema = SchemaFactory.createForClass(Attraction);
