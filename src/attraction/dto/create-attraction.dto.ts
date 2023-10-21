import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreatePhotoDto } from '@/dto/create-photo.dto';
import { CreateAddressDto } from '@/dto/create-address.dto';
import { CreateOpenHoursDto } from '@/dto/create-openHours.dto';
import { Type } from 'class-transformer';

export class CreateAttractionDto {
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
  openHours: CreateAddressDto;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePhotoDto)
  photos: CreatePhotoDto[];
}
