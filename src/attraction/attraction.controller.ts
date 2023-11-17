import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { Attraction } from '@/attraction/schema/attraction.schema';
import { AttractionFindOneDto } from './dto/attractionDto/get-attraction.dto';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { CreateAttractionDto } from './dto/attractionDto/create-attraction.dto';
import { FileValidationInterceptor } from '@/file/file-validation.interceptor';
import { plainToClass } from 'class-transformer';
import { CurrentUser } from '@/auth/CurrentUser.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileUploadDto } from '@/file/dto/file-upload.dto';
import { UpdateAttractionDto } from './dto/attractionDto/update-attraction.dto';

@Controller('attractions')
export class AttractionController {
  constructor(private readonly attractionService: AttractionService) {}

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
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files', 10), FileValidationInterceptor)
  async create(
    @CurrentUser() currentUser,
    @Body() createAttractionDto: CreateAttractionDto,
    @UploadedFiles() files: FileUploadDto[]
  ): Promise<Attraction> {
    const userId = currentUser._id;
    const attractionDto = plainToClass(CreateAttractionDto, createAttractionDto);
    return await this.attractionService.create(userId, attractionDto, files);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseInterceptors(FilesInterceptor('files', 10), FileValidationInterceptor)
  async updateAttraction(
    @Param('id') id: string,
    @CurrentUser() currentUser,
    @UploadedFiles() files: FileUploadDto[],
    @Body() updateAttractionDto: UpdateAttractionDto
  ): Promise<Attraction> {
    const attractionDto = plainToClass(UpdateAttractionDto, updateAttractionDto);
    return await this.attractionService.updateAttraction(id, files, attractionDto, currentUser._id);
  }
}
