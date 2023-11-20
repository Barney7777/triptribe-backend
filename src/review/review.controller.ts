import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/reviewDto/create-review.dto';
import { UpdateReviewDto } from './dto/reviewDto/update-review.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { FileUploadDto } from '@/file/dto/file-upload.dto';
import { FileValidationInterceptor } from '@/file/file-validation.interceptor';
import { AllExceptionsFilter } from '@/utils/allExceptions.filter';
import { AuthGuard } from '@nestjs/passport';
import { Review } from './schema/review.schema';
import { CurrentUser } from '@/auth/CurrentUser.decorator';
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
import { PlaceType } from './dto/reviewDto/base-review.dto';
import { PhotoType } from '@/schema/photo.schema';

@Controller({
  path: 'reviews',
  version: '1',
})
@ApiTags('reviews')
@UseFilters(AllExceptionsFilter)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Review', description: 'Create a new review successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Review data to create',
    schema: {
      type: 'object',
      required: ['title', 'description', 'rating', 'placeId', 'placeType'],
      properties: {
        title: { type: 'string', example: 'Review Title' },
        description: { type: 'string', example: 'Review Description' },
        rating: { type: 'integer', example: 4, minimum: 1, maximum: 5 },
        placeId: {
          type: 'string',
          format: 'ObjectId',
          example: '65562ede184d4aa3bc1c5975',
        },
        placeType: {
          type: 'string',
          enum: Object.values(PlaceType),
          example: PlaceType.RESTAURANT,
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
  @ApiResponse({ status: 201, description: 'Create a new review successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files', 10), FileValidationInterceptor)
  create(
    @UploadedFiles() files: FileUploadDto[],
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser
  ): Promise<Review> {
    const reviewDto = plainToClass(CreateReviewDto, createReviewDto);
    return this.reviewService.create(files, reviewDto, currentUser._id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Review', description: 'Update a review successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Review data to update',
    schema: {
      type: 'object',
      required: ['title', 'description', 'rating'],
      properties: {
        title: { type: 'string', example: 'Review Title' },
        description: { type: 'string', example: 'Review Description' },
        rating: { type: 'integer', example: 4, minimum: 1, maximum: 5 },
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
  @ApiParam({
    name: 'id',
    description: 'Review Id',
    required: true,
    type: String,
    format: 'ObjectId',
  })
  @ApiResponse({ status: 200, description: 'Update a review successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files', 10), FileValidationInterceptor)
  update(
    @Param('id') id: string,
    @UploadedFiles() files: FileUploadDto[],
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() currentUser
  ): Promise<Review | null> {
    const reviewDto = plainToClass(UpdateReviewDto, updateReviewDto);
    return this.reviewService.update(id, files, reviewDto, currentUser._id);
  }

  @ApiOperation({ summary: 'Get all Reviews', description: 'Retrieve all reviews successfully' })
  @ApiResponse({ status: 200, description: 'Retrieve all reviews successfully' })
  @Get()
  findAll(): Promise<Review[]> {
    return this.reviewService.findAll();
  }

  @ApiOperation({ summary: 'Get a Review', description: 'Retrieve a review successfully' })
  @ApiParam({
    name: 'id',
    description: 'Review Id',
    required: true,
    type: String,
    format: 'ObjectId',
  })
  @ApiResponse({ status: 200, description: 'Retrieve a review successfully' })
  @ApiResponse({ status: 404, description: 'Review Not Found' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review | null> {
    return this.reviewService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Review', description: 'Delete a review successfully' })
  @ApiParam({
    name: 'id',
    description: 'Review Id',
    required: true,
    type: String,
    format: 'ObjectId',
  })
  @ApiResponse({ status: 200, description: 'Delete a review successfully' })
  @ApiResponse({ status: 404, description: 'Review Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @CurrentUser() currentUser): Promise<Review | null> {
    return this.reviewService.remove(id, currentUser._id);
  }
}
