import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/reviewDto/create-review.dto';
import { UpdateReviewDto } from './dto/reviewDto/update-review.dto';
import { Review } from './schema/review.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileUploadDto } from '@/file/dto/file-upload.dto';
import { FileUploadService } from '@/file/file.service';
import { AllExceptionsFilter } from '@/utils/allExceptions.filter';
import { PhotoType } from '@/schema/photo.schema';
import { QueryReviewDto } from './dto/reviewDto/query-review.dto';
import { Ireview } from './types/interfaces/review.do';
import { UserIdDto } from '@/user/dto/userId.dto';
import { CreatePhotoDto } from '@/file/dto/create-photo.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private readonly fileUploadService: FileUploadService
  ) {}
  async create(files: FileUploadDto[], reviewDto: CreateReviewDto, userId: UserIdDto['_id']) {
    let photoDocuments: CreatePhotoDto[] = []; // Explicitly specify the type as CreatePhotoDto[]

    if (files && files.length > 0) {
      const uploadResults = await this.fileUploadService.uploadPhoto(
        userId,
        files,
        PhotoType.REVIEW
      );

      // Filter out unsuccessful upload results and map them to CreatePhotoDto
      photoDocuments = uploadResults
        .filter((result) => result.success) // Filter out unsuccessful uploads
        .map((result) => {
          // Map to CreatePhotoDto
          return {
            imageUrl: result.data.imageUrl,
            imageAlt: result.data.imageAlt,
            imageType: PhotoType.REVIEW,
            uploadUserId: result.data.uploadUserId, // Use @CurrentUser decorator to get the current user ID
          };
        });
    }

    // spread reviewDto and put "photos" and "userId" together in reviewData
    const reviewData: Ireview = { ...reviewDto, userId, photos: photoDocuments };
    // console.log('reviewData', reviewData);

    const review = await this.reviewModel.create(reviewData);
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

  async uploadPhoto(userId: UserIdDto['_id'], files: FileUploadDto[]) {
    try {
      // if files array no data, return []
      if (files.length === 0) {
        return [];
      }

      // call fileUploadService.uploadPhoto function, set 'files' as param
      const uploadResult = await this.fileUploadService.uploadPhoto(
        userId,
        files,
        PhotoType.REVIEW
      );

      // clarify an array "newPicArray", return value array.map into photos,
      const newPicArray = uploadResult.map((photo) => ({
        // need change return value object's "imageUrl" field to "imageUrl" and put value in
        imageUrl: photo.data.imageUrl,
        imageAlt: photo.data.imageAlt,
        // "imageType" as "review"
        imageType: PhotoType.REVIEW,
        // mock data, "uploadUserId" as JWT strategy return value "req.user._id"
        uploadUserId: photo.data.uploadUserId,
      }));
      return newPicArray;
    } catch (error) {
      throw new AllExceptionsFilter(error);
    }
  }

  async update(
    id: QueryReviewDto['id'],
    files: FileUploadDto[],
    updateReviewDto: UpdateReviewDto,
    userId: UserIdDto['_id']
  ) {
    //call verifyOwner() to verify currentUser with reviewCreator
    const previousReview = await this.findOneFromMe(id, userId);
    // photos is previous photos
    const previousPhotos = previousReview?.photos;
    // console.log('photos', previousPhotos);

    // photo array upload this time
    const currentPhotos = updateReviewDto.photos;
    // compare 2 photos array (previousPhotos and currentPhotos), find deletePhotos array
    const deletePhotos = previousPhotos?.filter((photo) => {
      return !currentPhotos.some(
        (currentPhoto) => currentPhoto?.imageUrl?.toString() === photo.imageUrl.toString()
      );
    });
    if (deletePhotos !== undefined && deletePhotos?.length > 0) {
      console.log('deletePhotos', deletePhotos);
      // TODO!!! if deletePhoto array exist,call function to delete photo
    }
    // call uploadPhoto function, set 'files' as param
    const newPicArray = await this.uploadPhoto(userId, files);
    // push newPicArray into currentPhotos
    currentPhotos.push(...newPicArray);
    // assign "currentPhotos" to "photos" , "userId" as "current_userId"
    const dataToUpdate: Ireview = {
      ...updateReviewDto,
      userId: userId,
      photos: currentPhotos,
    };
    // console.log('dataToUpdate', dataToUpdate);

    // call model to set 'dataToUpdate' to update
    const review = await this.reviewModel.findByIdAndUpdate(id, dataToUpdate, { new: true }).exec();
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
    //call verifyOwner() to verify currentUser with reviewCreator
    await this.findOneFromMe(id, userId);

    const review = await this.reviewModel.findByIdAndDelete(id).exec();
    return review;
  }
}
