import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { AttractionModule } from '@/attraction/attraction.module';
import { RestaurantModule } from '@/restaurant/restaurant.module';
import { RestaurantService } from '@/restaurant/restaurant.service';
import { AttractionService } from '@/attraction/attraction.service';

@Module({
  imports: [AttractionModule, RestaurantModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
