import { IsArray, IsEmail, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAddressDto } from '@/dto/create-address.dto';
import { CreateOpenHoursDto } from '@/dto/create-openHours.dto';
import { Type } from 'class-transformer';
import { CreatePhotoDto } from '@/file/dto/create-photo.dto';

export class BaseAttractionDto {
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

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreatePhotoDto)
  // photos: CreatePhotoDto[];

  @IsMongoId()
  createdUserId: string;
}
