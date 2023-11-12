import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttractionService } from './attraction.service';
import { AttractionController } from './attraction.controller';
import { Attraction, AttractionSchema } from './schema/attraction.schema';
import { FileUploadModule } from '@/file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Attraction.name, schema: AttractionSchema }]),
    FileUploadModule,
  ],
  controllers: [AttractionController],
  providers: [AttractionService],
})
export class AttractionModule {}
