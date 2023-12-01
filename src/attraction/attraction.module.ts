import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttractionService } from './attraction.service';
import { AttractionController } from './attraction.controller';
import { Attraction, AttractionSchema } from '@/attraction/schema/attraction.schema';
import { FileUploadModule } from '@/file/file.module';
import { Review, ReviewSchema } from '@/review/schema/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attraction.name, schema: AttractionSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    FileUploadModule,
  ],
  controllers: [AttractionController],
  providers: [AttractionService],
  exports: [AttractionService],
})
export class AttractionModule {}
