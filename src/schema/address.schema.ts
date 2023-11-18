import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ _id: false })
export class Location {
  @Field()
  @Prop({ required: true })
  lat: number;

  @Field()
  @Prop({ required: true })
  lng: number;
}

@ObjectType()
@Schema({ _id: false })
export class Address {
  @Field()
  @Prop({ required: true })
  formattedAddress: string;

  @Field(() => Location, { nullable: true })
  @Prop({ _id: false, required: true, type: Location, index: '2dsphere' })
  location?: Location;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
