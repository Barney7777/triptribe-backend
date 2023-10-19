import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  formattedAddress: string;

  @Prop({ _id: false, required: true, type: { lat: Number, lng: Number } })
  location: {
    lat: number;
    lng: number;
  };
}

export const AddressSchema = SchemaFactory.createForClass(Address);
