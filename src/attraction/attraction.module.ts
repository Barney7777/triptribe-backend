import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttractionService } from './attraction.service';
import { AttractionController } from './attraction.controller';
import { Attraction, AttractionSchema } from '@/attraction/schema/attraction.schema';
import { FileUploadModule } from '@/file/file.module';
import { Review, ReviewSchema } from '@/review/schema/review.schema';
import { ReviewModule } from '@/review/review.module';
import { AttractionResolver } from './attraction.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attraction.name, schema: AttractionSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    FileUploadModule,
    ReviewModule,
  ],
  controllers: [AttractionController],
  providers: [AttractionService, AttractionResolver],
  exports: [AttractionService],
})
export class AttractionModule {}
