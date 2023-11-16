import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileUploadDto } from './dto/file-upload.dto';
import { FileUploadService } from './file.service';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(private fileUploadService: FileUploadService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log('Interceptor - Received _id:', request.params.id);
    console.log('Interceptor - Received body:', request.body);
    const files: FileUploadDto[] = request.files;

    const invalidFiles: Array<{ file: FileUploadDto }> = [];
    if (files) {
      files.forEach((file) => {
        if (
          !this.fileUploadService.validateImage(file) ||
          !this.fileUploadService.validateFileSize(file)
        ) {
          invalidFiles.push({ file: file });
        }
      });
    }

    return next.handle().pipe(
      map((data) => {
        if (invalidFiles.length > 0) {
          data.invalidFiles = invalidFiles;
        }
        return data;
      })
    );
  }
}
