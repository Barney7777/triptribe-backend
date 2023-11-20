import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './schema/restaurant.schema';
import { FileUploadModule } from '@/file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }]),
    FileUploadModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
