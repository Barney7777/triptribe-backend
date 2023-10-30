import { Body, Controller, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { Attraction } from './schema/attraction.schema';
import { AttractionFindOneDto } from './dto/get-attraction.dto';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { FileValidationInterceptor } from '@/file/file-validation.interceptor';
import { FileUploadDto } from '@/file/dto/file-upload.dto';
import { plainToClass } from 'class-transformer';
import { CurrentUser } from '@/auth/CurrentUser.decorator';
import { AuthGuard } from '@nestjs/passport';
@Controller('attractions')
export class AttractionController {
  constructor(private readonly attractionService: AttractionService) { }

  @Get(':id')
  @Version('1')
  async findOne(@Param() params: AttractionFindOneDto): Promise<Attraction> {
    return this.attractionService.findOne(params.id);
  }

  @Get()
  @Version('1')
  async findAll(): Promise<Attraction[]> {
    return this.attractionService.findAll();
  }

  @Post()
  @Version('1')
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FilesInterceptor('files', 10), FileValidationInterceptor)
  async create(@CurrentUser() currentUser, @Body() createAttractionDto: CreateAttractionDto, @UploadedFiles() files: FileUploadDto[]): Promise<Attraction> {
    const userId = currentUser._id
    const attractionDto = plainToClass(CreateAttractionDto, createAttractionDto);
    return await this.attractionService.create(userId, attractionDto, files);
  }
}
