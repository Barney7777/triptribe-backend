import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantFindOneDto } from './dto/get-restaurant.dto';
import { Restaurant } from './schema/restaurant.schema';
import { FileValidationInterceptor } from '@/file/file-validation.interceptor';

@Controller({
  path: 'restaurants',
  version: '1',
})
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async findAll(): Promise<Restaurant[]> {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: RestaurantFindOneDto): Promise<Restaurant> {
    return this.restaurantService.findOne(params.id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10), FileValidationInterceptor)
  async create(
    @UploadedFiles() files: Multer.File[],
    @Body() createRestaurantDto: CreateRestaurantDto
  ): Promise<Restaurant> {
    return this.restaurantService.create(createRestaurantDto, files);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files', 10), FileValidationInterceptor)
  async update(
    @Param() params: RestaurantFindOneDto,
    @UploadedFiles() files: Multer.File[],
    @Body() updateRestaurantDto: UpdateRestaurantDto
  ): Promise<Restaurant> {
    return this.restaurantService.update(params.id, updateRestaurantDto, files);
  }
}
