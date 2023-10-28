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

@Injectable()
export class FileUploadService {
  private s3 = new AWS.S3();

  constructor(
    private configService: ConfigService,
    @InjectModel(Photo.name) private readonly photoModel: Model<Photo>
  ) {}

  async uploadPhoto(
    files: Multer.File[]
  ): Promise<{ success: boolean; data: any; imageName?: string }[]> {
    const validationResult = this.validateFiles(files);

    if (!validationResult.valid) {
      return validationResult.results;
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const result: { success: boolean; data: any; imageName?: string } = {
          success: false,
          data: null,
        };

        try {
          result.data = await this.uploadSingleFileToS3(file);
          result.success = true;
        } catch (error) {
          result.data = `Error uploading to S3: ${error.message}`;
        }

        if (result.success) {
          await this.savePhotoToDatabase(file, result.data.Location);
        }

        return result;
      })
    );

    return results;
  }

  async savePhotoToDatabase(file: Multer.File, imageUrl: string): Promise<void> {
    const photo = new this.photoModel({
      imageAlt: file.originalname,
      imageUrl: imageUrl,
      imageType: PhotoType.USER,
      uploadUserId: 'user123',
    });
    await photo.save();
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

  validateFiles(files: Multer.File[]): { valid: boolean; results: { success: boolean; data: any; imageName?: string }[] } {
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
