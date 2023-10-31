import { Module } from '@nestjs/common';
import { FileUploadService } from './file.service';
import { FileUploadController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from '@/schema/photo.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }])],
  providers: [FileUploadService],
  controllers: [FileUploadController],
  exports: [FileUploadService],
})
export class FileUploadModule {}
