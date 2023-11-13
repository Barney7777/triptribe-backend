import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { SearchService } from './search.service';
import { AllExceptionsFilter } from '@/utils/allExceptions.filter';
import { GlobalSearchDto } from './dto/globalSearch.dto';
import { IGlobalSearch } from './type/interfaces/globalSearch.do';
import { plainToClass } from 'class-transformer';

@Controller({
  path: 'search',
  version: '1',
})
@UseFilters(AllExceptionsFilter)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('globalSearch')
  globalSearch(@Body() searchInfo: GlobalSearchDto): Promise<IGlobalSearch> {
    const searchInfoDto = plainToClass(GlobalSearchDto, searchInfo);

    return this.searchService.globalSearch(searchInfoDto);
  }
}
