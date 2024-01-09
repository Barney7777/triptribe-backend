import { Query, Resolver } from '@nestjs/graphql';
import { Attraction } from './schema/attraction.schema';
import { UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '@/utils/allExceptions.filter';
import { AttractionService } from './attraction.service';

@Resolver(() => Attraction)
@UseFilters(HttpExceptionFilter)
export class AttractionResolver {
  constructor(private readonly attractionService: AttractionService) {}

  @Query(() => [Attraction], {
    description: 'Get all attractions',
  })
  async getAllAttractions(): Promise<Attraction[]> {
    return this.attractionService.findAll();
  }
}
