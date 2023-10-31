import { Controller, Post, UseInterceptors, UploadedFiles, Res } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { FileUploadService } from './file.service';
import { FileUploadDto } from './dto/file-upload.dto';
import { FileValidationInterceptor } from './file-validation.interceptor';
import { Response } from 'express';
import { PhotoType } from '@/schema/photo.schema';

@Controller('photo')
@UseInterceptors(FilesInterceptor('files', 10), FileValidationInterceptor)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  async uploadFiles(@UploadedFiles() files: FileUploadDto[], @Res() res: Response) {
    const results = await this.fileUploadService.uploadPhoto(files, PhotoType.USER);

    const successResults = results.filter((result) => result.success);
    const errorResults = results.filter((result) => !result.success);

    if (errorResults.length > 0) {
      const failedUploads = errorResults.map((error) => {
        return {
          message: error.data,
        };
      });

      return res.status(400).json(failedUploads);
    } else {
      return res.status(201).json(successResults);
    }
  }
}
