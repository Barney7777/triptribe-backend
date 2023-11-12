import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAddressDto } from '@/dto/create-address.dto';
import { CreateOpenHoursDto } from '@/dto/create-openHours.dto';
import { Type } from 'class-transformer';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  website: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @ValidateNested()
  @Type(() => CreateOpenHoursDto)
  openHours: CreateOpenHoursDto;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
