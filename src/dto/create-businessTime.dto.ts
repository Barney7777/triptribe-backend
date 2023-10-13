import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';

class PeriodDto {
  @IsString()
  openTime: string;

  @IsString()
  closeTime: string;
}

export class CreateBusinessTimeDto {
  @IsBoolean()
  isOpenAllDay: boolean;

  @IsBoolean()
  isClosed: boolean;

  @IsArray()
  @ValidateNested()
  @Type(() => PeriodDto)
  location: PeriodDto[];
}
