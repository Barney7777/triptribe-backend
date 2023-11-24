import { model, Schema } from 'mongoose';

export interface ILocation {
  lat: number;
  lng: number;
}

export const LocationSchema = new Schema<ILocation>({
  lat: { type: 'number', required: true },
  lng: { type: 'number', required: true },
});

export interface IAddress {
  formattedAddress: string;
  location: ILocation;
}

export const AddressSchema = new Schema<IAddress>({
  formattedAddress: { type: 'String', required: true },
  location: { type: LocationSchema, required: true },
});
