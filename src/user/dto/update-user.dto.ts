import { Exclude } from 'class-transformer';
import { Photo } from '@/schema/photo.schema';
import { IsString, IsOptional, IsNotEmptyObject } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly nickname?: string;

  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsOptional()
  @IsNotEmptyObject()
  readonly userAvatar?: Photo;

  @Exclude()
  readonly role?: string;

  @Exclude()
  readonly createdAt?: Date;

  @Exclude()
  readonly updatedAt?: Date;
}
