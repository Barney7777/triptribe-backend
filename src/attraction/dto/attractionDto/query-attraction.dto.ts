import { IsMongoId } from 'class-validator';

export class QueryAttractionDto {
  @IsMongoId()
  id: string;
}
