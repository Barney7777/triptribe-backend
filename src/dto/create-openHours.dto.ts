import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { CreateBusinessTimeDto } from './create-businessTime.dto';

export class CreateOpenHoursDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Monday: CreateBusinessTimeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Tuesday: CreateBusinessTimeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Wednesday: CreateBusinessTimeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Thursday: CreateBusinessTimeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Friday: CreateBusinessTimeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Saturday: CreateBusinessTimeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Sunday: CreateBusinessTimeDto;
}
