import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetDataListInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sort?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  skip?: number;
}
