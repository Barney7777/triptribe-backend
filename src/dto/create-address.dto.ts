import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class LocationDto {
  @IsNumber()
  Lat: number;

  @IsNumber()
  lng: number;
}

export class CreateAddressDto {
  @IsString()
  formattedAddress: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
