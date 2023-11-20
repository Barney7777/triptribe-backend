import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { LocationDto } from '../../dto/create-address.dto';
import { ApiProperty } from '@nestjs/swagger/dist';

export enum PlaceType {
  ATTRACTION = 'Attraction',
  RESTAURANT = 'Restaurant',
}

export class GlobalSearchDto {
  @ApiProperty({
    example: 'r',
    required: true,
  })
  @IsString()
  keyword: string;

  @ApiProperty({
    example: 10,
    required: true,
  })
  @IsNumber()
  @Min(1)
  limit: number;

  @ApiProperty({
    example: 10000000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDistance?: number;

  @ApiProperty({
    example: {
      lat: -29.9485,
      lng: -88.3598,
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}
