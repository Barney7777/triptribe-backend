import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { Attraction } from '@/attraction/schema/attraction.schema';
import { AttractionFindOneDto } from './dto/attractionDto/get-attraction.dto';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { CreateAttractionDto } from './dto/attractionDto/create-attraction.dto';
import { FileValidationInterceptor } from '@/file/file-validation.interceptor';
import { plainToClass } from 'class-transformer';
import { CurrentUser } from '@/auth/CurrentUser.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileUploadDto } from '@/file/dto/file-upload.dto';
import { UpdateAttractionDto } from './dto/attractionDto/update-attraction.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PhotoType } from '@/schema/photo.schema';
import { RatingDistribution } from './types/interfaces/ratingDistribution.interface';
import { AllExceptionsFilter } from '@/utils/allExceptions.filter';

@Controller({
  path: 'attractions',
  version: '1',
})
@ApiTags('attractions')
@UseFilters(AllExceptionsFilter)
export class AttractionController {
  constructor(private readonly attractionService: AttractionService) {}

  @ApiOperation({
    summary: 'Get an attraction',
    description: 'Retrieve an attraction successfully',
  })
  @ApiParam({
    name: 'id',
    description: 'Attraction Id',
    required: true,
    type: String,
    format: 'ObjectId',
  })
  @ApiResponse({ status: 200, description: 'Retrieve an attraction successfully' })
  @ApiResponse({ status: 404, description: 'Attraction Not Found' })
  @Get(':id')
  async findOne(@Param() params: AttractionFindOneDto): Promise<Attraction> {
    return this.attractionService.findOne(params.id);
  }

  @ApiOperation({
    summary: 'Get all Attractions',
    description: 'Retrieve all attractions successfully',
  })
  @ApiResponse({ status: 200, description: 'Retrieve all attractions successfully' })
  @Get()
  async findAll(): Promise<Attraction[]> {
    return this.attractionService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Attraction',
    description: 'Create a new attraction successfully',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Attraction data to create',
    schema: {
      type: 'object',
      required: ['name', 'description', 'email', 'phone'],
      properties: {
        name: { type: 'string', example: 'Denesik Route' },
        description: {
          type: 'string',
          example:
            'Pauper delectatio avaritia consectetur super vesco quasi vulticulus necessitatibus constans.',
        },
        website: {
          type: 'string',
          example: 'http://dimpled-housing.net',
        },
        email: {
          type: 'string',
          example: 'DenesikRoute13@gmail.com',
        },
        phone: {
          type: 'string',
          example: '(679) 497-4605 x3175',
        },
        openHours: {
          type: 'object',
          example: {
            Monday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Tuesday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Wednesday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Thursday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Friday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Saturday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Sunday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
          },
        },
        address: {
          type: 'object',
          example: {
            formattedAddress: '25474 Ratke Passage Suite 979',
            location: {
              lat: -88.9277,
              lng: -40.1176,
            },
          },
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'An array of images',
        },
      },
    },
  } as ApiBodyOptions)
  @ApiResponse({ status: 201, description: 'Create a new attraction successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files', 10), FileValidationInterceptor)
  async create(
    @CurrentUser() currentUser,
    @Body() createAttractionDto: CreateAttractionDto,
    @UploadedFiles() files: FileUploadDto[]
  ): Promise<Attraction> {
    const userId = currentUser._id;
    const attractionDto = plainToClass(CreateAttractionDto, createAttractionDto);
    return await this.attractionService.create(userId, attractionDto, files);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Attraction',
    description: 'Update an attraction successfully',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'Attraction Id',
    required: true,
    type: String,
    format: 'ObjectId',
  })
  @ApiBody({
    description: 'Attraction data to update',
    schema: {
      type: 'object',
      required: ['name', 'description', 'email', 'phone'],
      properties: {
        name: { type: 'string', example: 'Denesik Route' },
        description: {
          type: 'string',
          example:
            'Pauper delectatio avaritia consectetur super vesco quasi vulticulus necessitatibus constans.',
        },
        website: {
          type: 'string',
          example: 'http://dimpled-housing.net',
        },
        email: {
          type: 'string',
          example: 'DenesikRoute13@gmail.com',
        },
        phone: {
          type: 'string',
          example: '(679) 497-4605 x3175',
        },
        openHours: {
          type: 'object',
          example: {
            Monday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Tuesday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Wednesday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Thursday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Friday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Saturday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
            Sunday: {
              isOpenAllDay: false,
              isClosed: false,
              period: [
                {
                  openTime: '06:00',
                  closeTime: '18:00',
                },
              ],
            },
          },
        },
        address: {
          type: 'object',
          example: {
            formattedAddress: '25474 Ratke Passage Suite 979',
            location: {
              lat: -88.9277,
              lng: -40.1176,
            },
          },
        },
        photos: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              imageAlt: { type: 'string' },
              imageUrl: { type: 'string' },
              imageType: { type: 'enum', enum: Object.values(PhotoType) },
              uploadUserId: { type: 'string' },
              _id: { type: 'string' },
            },
          },
          description: 'An array of photos',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'An array of images',
        },
      },
    },
  } as ApiBodyOptions)
  @ApiResponse({ status: 200, description: 'Update an attraction successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseInterceptors(FilesInterceptor('files', 10), FileValidationInterceptor)
  async updateAttraction(
    @Param('id') id: string,
    @CurrentUser() currentUser,
    @UploadedFiles() files: FileUploadDto[],
    @Body() updateAttractionDto: UpdateAttractionDto
  ): Promise<Attraction> {
    const attractionDto = plainToClass(UpdateAttractionDto, updateAttractionDto);
    return await this.attractionService.updateAttraction(id, files, attractionDto, currentUser._id);
  }

  @Get(':id/rating-distributions')
  async getAttractionRating(@Param() params: AttractionFindOneDto): Promise<RatingDistribution[]> {
    return await this.attractionService.findAttractionRating(params.id);
  }
}
