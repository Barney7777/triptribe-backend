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

@Controller({
  path: 'reviews',
  version: '1',
})
@UseFilters(AllExceptionsFilter)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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

  @Get()
  findAll(): Promise<Review[]> {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review | null> {
    return this.reviewService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @CurrentUser() currentUser): Promise<Review | null> {
    return this.reviewService.remove(id, currentUser._id);
  }
}
