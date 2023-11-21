import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAddressDto } from '@/dto/create-address.dto';
import { CreateOpenHoursDto } from '@/dto/create-openHours.dto';
import { Transform, Type } from 'class-transformer';
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
  @Transform(({ value }) => JSON.parse(value))
  openHours: CreateOpenHoursDto;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  @Transform(({ value }) => JSON.parse(value))
  address: CreateAddressDto;
}
