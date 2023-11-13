import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { LocationDto } from '../../dto/create-address.dto';

export enum PlaceType {
  ATTRACTION = 'Attraction',
  RESTAURANT = 'Restaurant',
}

export class GlobalSearchDto {
  @IsString()
  keyword: string;

  @IsNumber()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDistance?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}
