import { Injectable, BadRequestException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Multer } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadDto } from './dto/file-upload.dto';
import { allowedMimeTypes, maxSize } from './file-constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoType } from '../schema/photo.schema';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UserIdDto } from '@/user/dto/userId.dto';

@Injectable()
export class FileUploadService {
  private s3: AWS.S3;
  constructor(
    private configService: ConfigService,
    @InjectModel(Photo.name) private readonly photoModel: Model<Photo>
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      region: configService.get('AWS_DEFAULT_REGION'),
    });
  }

  async uploadPhoto(
    userId: UserIdDto['_id'],
    files: Multer.File[],
    imageType: PhotoType
  ): Promise<{ success: boolean; data: any; imageName?: string }[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image files have been uploaded.');
    }

    const validationResult = this.validateFiles(files);

    if (!validationResult.valid) {
      return validationResult.results;
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const result: { success: boolean; data: CreatePhotoDto | string; imageName?: string } = {
          success: false,
          data: '',
        };

        try {
          const uploadedFile = await this.uploadSingleFileToS3(file);
          result.data = await this.savePhotoToDatabase(
            userId,
            file,
            uploadedFile.Location,
            imageType
          );
          result.success = true;
        } catch (error) {
          result.data = `Error uploading to S3: ${error.message}`;
        }

        return result;
      })
    );

    return results;
  }

  async savePhotoToDatabase(
    userId: UserIdDto['_id'],
    file: Multer.File,
    imageUrl: string,
    imageType: PhotoType
  ): Promise<CreatePhotoDto> {
    const photo = new this.photoModel({
      imageAlt: file.originalname,
      imageUrl: imageUrl,
      imageType,
      uploadUserId: userId,
    });
    return await photo.save();
  }

  async uploadSingleFileToS3(file: Multer.File): Promise<AWS.S3.ManagedUpload.SendData> {
    const uuid = uuidv4();
    const bucketName = this.configService.get('S3_BUCKET_NAME');

    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME is not defined.');
    }

    const key = `${uuid}-${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await this.s3.upload(params).promise();

    return result;
  }

  validateFiles(files: Multer.File[]): {
    valid: boolean;
    results: { success: boolean; data: any; imageName?: string }[];
  } {
    if (!Array.isArray(files)) {
      return {
        valid: false,
        results: [{ success: false, data: 'No photos are provided for uploading.' }],
      };
    }

    const results = files.map((file) => {
      const result: { success: boolean; data: any; imageName?: string } = {
        success: false,
        data: null,
      };

      if (this.validateImage(file) && this.validateFileSize(file)) {
        result.success = true;
      } else {
        result.data = `Invalid file type or size. Only JPEG, PNG, and GIF files up to 10MB are allowed: ${file.originalname}`;
      }

      return result;
    });

    const valid = results.every((result) => result.success);

    if (!valid) {
      const errors = results.filter((result) => !result.success).map((result) => result.data);
      throw new BadRequestException(`File validation failed: ${errors.join(', ')}`);
    }

    return { valid, results };
  }

  validateImage(file: FileUploadDto): boolean {
    return allowedMimeTypes.includes(file.mimetype);
  }

  validateFileSize(file: FileUploadDto): boolean {
    return file.size <= maxSize;
  }

  handleError(res: Response, message: string, statusCode: string = '400') {
    throw new BadRequestException(message, statusCode);
  }
}
