import { Field, Float, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
@InputType()
class LocationDto {
  @Field(() => Float)
  @IsNumber()
  lat: number;

  @Field(() => Float)
  @IsNumber()
  lng: number;
}

@InputType()
export class CreateAddressDto {
  @Field()
  @IsString()
  formattedAddress: string;

  @Field(() => LocationDto, { nullable: true })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;
}
