import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schema/review.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileUploadDto } from '@/file/dto/file-upload.dto';
import { FileUploadService } from '@/file/file.service';
import { PhotoType } from '@/schema/photo.schema';
import { QueryReviewDto } from './dto/query-review.dto';
import { IReview } from './types/interfaces/review.do';
import { UserIdDto } from '@/user/dto/userId.dto';
import { CreatePhotoDto } from '@/file/dto/create-photo.dto';
import { Restaurant } from '@/restaurant/schema/restaurant.schema';
import { Attraction } from '@/attraction/schema/attraction.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_PROCESS_CALCULATE_OVERALLRATING } from '@/common/constant/queue.constant';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private readonly fileUploadService: FileUploadService,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    @InjectModel(Attraction.name) private attractionModel: Model<Attraction>,
    @InjectQueue('database-sync') private databaseSync: Queue
  ) {}
  async create(files: FileUploadDto[], reviewDto: CreateReviewDto, userId: UserIdDto['_id']) {
    const { placeId, placeType } = reviewDto;
    if (!(await this.checkPlaceExists(placeId, placeType))) {
      throw new NotFoundException('the place id does not exist or place type is wrong');
    }
    let photoDocuments: CreatePhotoDto[] = [];

    if (files && files.length > 0) {
      const uploadResults = await this.fileUploadService.uploadPhoto(
        userId,
        files,
        PhotoType.REVIEW
      );

      photoDocuments = uploadResults.map((photo) => photo.data);
    }

    // spread reviewDto and put "photos" and "userId" together in reviewData
    const reviewData: IReview = { ...reviewDto, userId, photos: photoDocuments };

    const review = await this.reviewModel.create(reviewData);

    await this.databaseSync.add(
      QUEUE_PROCESS_CALCULATE_OVERALLRATING,
      {
        placeType: review.placeType,
        placeId: review.placeId,
      },
      { delay: 100 }
    );

    return review;
  }

  async findAll() {
    const reviews = await this.reviewModel.find().exec();
    return reviews;
  }

  async findOne(id: QueryReviewDto['id']) {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException('The review does not exist');
    }
    return review;
  }

  async update(
    id: QueryReviewDto['id'],
    files: FileUploadDto[],
    updateReviewDto: UpdateReviewDto,
    userId: UserIdDto['_id']
  ): Promise<Review> {
    // verify if current user is owner
    const previousReview = await this.findOneFromMe(id, userId);

    const previousPhotos = previousReview?.photos;
    let currentPhotos = updateReviewDto.photos;

    // compare 2 photos array (previousPhotos and currentPhotos), find deletePhotos array
    let deletePhotos;
    if (currentPhotos) {
      deletePhotos = previousPhotos?.filter((photo) => {
        return !currentPhotos?.some(
          (currentPhoto) => currentPhoto?.imageUrl?.toString() === photo.imageUrl.toString()
        );
      });
    } else {
      currentPhotos = [];
      deletePhotos = previousPhotos;
    }
    if (deletePhotos !== undefined && deletePhotos?.length > 0) {
      console.log('deletePhotos', deletePhotos);
      // TODO!!! if deletePhoto exists, call function to delete photos in DB and AWS
    }

    // upload new photos to AWS and save it with current photos
    if (files && files.length > 0) {
      const results = await this.fileUploadService.uploadPhoto(userId, files, PhotoType.REVIEW);
      const newPicArray = results.map((photo) => photo.data);
      currentPhotos.push(...newPicArray);
    }

    const dataToUpdate: IReview = {
      ...updateReviewDto,
      userId: userId,
      photos: currentPhotos,
    };

    // call model to set 'dataToUpdate' to update
    const review = await this.reviewModel.findByIdAndUpdate(id, dataToUpdate, { new: true }).exec();
    if (!review) {
      throw new BadRequestException('Update operation failed');
    }
    return review;
  }

  async findOneFromMe(reviewId: string, current_userId: string) {
    // find userId relate to review and compare with current userId
    const reviewData = await this.findOne(reviewId);
    const userId = reviewData?.userId;
    // if userId not match, no permission to update
    if (current_userId.toString() !== userId?.toString()) {
      throw new ForbiddenException('You have no permission to access this resource!');
    }
    return reviewData;
  }

  async remove(id: QueryReviewDto['id'], userId: UserIdDto['_id']) {
    // verify if current user is owner
    await this.findOneFromMe(id, userId);

    const review = await this.reviewModel.findByIdAndDelete(id).exec();
    return review;
  }

  async checkPlaceExists(placeId: string, placeType: string): Promise<boolean> {
    const restaurantDocument = await this.restaurantModel.findById(placeId).exec();
    const attractionDocument = await this.attractionModel.findById(placeId).exec();
    if (
      (restaurantDocument && placeType === 'Restaurant') ||
      (attractionDocument && placeType === 'Attraction')
    ) {
      return true;
    }
    return false;
  }
}
