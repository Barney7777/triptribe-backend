import { Controller, Get, Param, Version } from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { Attraction } from './schema/attraction.schema';
import { AttractionFindOneDto } from './dto/get-attraction.dto';

@Controller('attractions')
export class AttractionController {
  constructor(private readonly attractionService: AttractionService) {}

  @Get(':id')
  @Version('1')
  async findOne(@Param() params: AttractionFindOneDto): Promise<Attraction> {
    return this.attractionService.findOne(params.id);
  }

  @Get()
  @Version('1')
  async findAll(): Promise<Attraction[]> {
    return this.attractionService.findAll();
  }
}
