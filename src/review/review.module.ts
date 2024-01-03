import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';
import { FileUploadModule } from '@/file/file.module';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME_DATABASE_SYNC } from '@/common/constant/queue.constant';
import { DatabaseSyncConsumer } from './consumers/review.consumer';
import { Attraction, AttractionSchema } from '@/attraction/schema/attraction.schema';
import { Restaurant, RestaurantSchema } from '@/restaurant/schema/restaurant.schema';
import { ReviewResolver } from './review.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Attraction.name, schema: AttractionSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    FileUploadModule,
    BullModule.registerQueue({
      name: QUEUE_NAME_DATABASE_SYNC,
    }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, DatabaseSyncConsumer, ReviewResolver],
  exports: [ReviewService],
})
export class ReviewModule {}
