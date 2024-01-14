import {
  Injectable,
  LoggerService,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoType } from '../schema/photo.schema';
import { UserIdDto } from '@/user/dto/userId.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { Readable } from 'stream';
import { IUpload } from './dto/upload.interface';

@Injectable()
export class FileUploadService {
  private s3: AWS.S3;
  private readonly loggerService: LoggerService;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Photo.name) private readonly photoModel: Model<Photo>
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      region: configService.get('AWS_DEFAULT_REGION'),
    });
    this.loggerService = new Logger(FileUploadService.name);
  }

  async uploadPhoto(
    userId: UserIdDto['_id'],
    files: FileUploadDto[],
    imageType: PhotoType
  ): Promise<{ data: Photo }[]> {
    const results = await Promise.all(
      files.map(async (file) => {
        const uploadedFile = await this.uploadSingleFileToS3(file);
        const result = await this.savePhotoToDatabase(
          userId,
          file,
          uploadedFile.Location,
          imageType
        );

        return { data: result };
      })
    );

    return results;
  }

  async savePhotoToDatabase(
    userId: UserIdDto['_id'],
    file: FileUploadDto,
    imageUrl: string,
    imageType: PhotoType
  ): Promise<Photo> {
    const photo = new this.photoModel({
      imageAlt: file.originalname,
      imageUrl: imageUrl,
      imageType,
      uploadUserId: userId,
    });
    return await photo.save();
  }

  async uploadSingleFileToS3(file: FileUploadDto): Promise<AWS.S3.ManagedUpload.SendData> {
    const uuid = uuidv4();
    const bucketName = this.configService.get('S3_BUCKET_NAME');

    if (!bucketName) {
      throw new InternalServerErrorException('S3_BUCKET_NAME is not defined.');
    }

    const key = `${uuid}-${file.originalname}`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      return await this.s3.upload(params).promise();
    } catch (error) {
      this.loggerService.error(error);
      throw new InternalServerErrorException('Error uploading image');
    }
  }

  validateImage(mimetype: string): string | false {
    const val = mimetype.split('/');
    if (val[0] !== 'image') return false;
    return val[1] ?? false;
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer: Uint8Array[] = [];

    return new Promise((resolve, reject) =>
      stream
        .on('error', (error) => reject(error))
        .on('data', (data) => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer)))
    );
  }

  async graphqlFileTransform(files: IUpload[]): Promise<FileUploadDto[]> {
    const resultFiles = await Promise.all(
      files.map(async (file) => {
        const stream = file.createReadStream();
        const fileBuffer = await this.streamToBuffer(stream as Readable);
        const fileType = this.validateImage(file.mimetype);
        if (!fileType) {
          throw new BadRequestException(
            `The following file is not valid image -- ${file.filename}`
          );
        }
        return {
          originalname: file.filename,
          size: fileBuffer.byteLength,
          encoding: file.encoding,
          mimetype: file.mimetype,
          buffer: fileBuffer,
        };
      })
    );
    return resultFiles;
  }
}
