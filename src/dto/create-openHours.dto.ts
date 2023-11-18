import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { CreateBusinessTimeDto } from './create-businessTime.dto';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOpenHoursDto {
  @Field(() => CreateBusinessTimeDto, { nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Monday: CreateBusinessTimeDto;

  @Field(() => CreateBusinessTimeDto, { nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Tuesday: CreateBusinessTimeDto;

  @Field(() => CreateBusinessTimeDto, { nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Wednesday: CreateBusinessTimeDto;

  @Field(() => CreateBusinessTimeDto, { nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Thursday: CreateBusinessTimeDto;

  @Field(() => CreateBusinessTimeDto, { nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Friday: CreateBusinessTimeDto;

  @Field(() => CreateBusinessTimeDto, { nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Saturday: CreateBusinessTimeDto;

  @Field(() => CreateBusinessTimeDto, { nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBusinessTimeDto)
  Sunday?: CreateBusinessTimeDto;
}
