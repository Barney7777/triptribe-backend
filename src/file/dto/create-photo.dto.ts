import { PhotoType } from '@/schema/photo.schema';
import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsEnum } from 'class-validator';

@InputType()
export class CreatePhotoDto {
  @Field()
  @IsString()
  imageAlt: string;

  @Field()
  @IsString()
  imageUrl: string;

  @Field(() => PhotoType)
  @IsEnum(PhotoType)
  imageType: PhotoType;

  @Field()
  @IsString()
  uploadUserId: string;
}
