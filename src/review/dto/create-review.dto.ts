import { IsEnum, IsMongoId } from 'class-validator';
import { BaseReviewDto } from './base-review.dto';

export enum PlaceType {
  ATTRACTION = 'Attraction',
  RESTAURANT = 'Restaurant',
}
export class CreateReviewDto extends BaseReviewDto {
  @IsMongoId()
  placeId: string;

  @IsEnum(PlaceType)
  placeType: string;
}
