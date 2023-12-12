import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';
import { FileUploadModule } from '@/file/file.module';
import { Attraction, AttractionSchema } from '@/attraction/schema/attraction.schema';
import { Restaurant, RestaurantSchema } from '@/restaurant/schema/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Attraction.name, schema: AttractionSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    FileUploadModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
