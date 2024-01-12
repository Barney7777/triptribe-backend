import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Post,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { CurrentUser } from '@/auth/CurrentUser.decorator';
import { getSavedPlaceDto } from './dto/get-saved-place.dto';
import { deleteSavedPlaceDto } from './dto/delete-save-place.dto';
import { SavePlaceDto } from './dto/save-place.dto';
import { plainToClass } from 'class-transformer';
import { Attraction } from '@/attraction/schema/attraction.schema';
import { Restaurant } from '@/restaurant/schema/restaurant.schema';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get me', description: 'Retrieve me successfully' })
  @ApiResponse({ status: 200, description: 'Retrieve me successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  getMe(@CurrentUser() currentUser): User {
    return this.userService.getMe(currentUser);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an user', description: 'Retrieve an user successfully' })
  @ApiParam({
    name: 'id',
    description: 'User Id',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Retrieve an user by ID successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard('jwt'))
  async find(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post('me/saves')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Place saved successfully' })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @ApiBody({
    description: 'add save places',
    schema: {
      type: 'object',
      required: ['placeId', 'placeType'],
      properties: {
        placeId: { type: 'string', example: '657256dff1fc083b3fe4177d' },
        placeType: { type: 'string', example: 'Attraction' },
      },
    },
  })
  create(@CurrentUser() currentUser, @Body() savePlaceDto: SavePlaceDto): Promise<void> {
    return this.userService.addSavedPlace(currentUser, savePlaceDto);
  }

  @Get(':id/saves/:placeType')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Get saved places successfully' })
  @ApiParam({
    name: 'id',
    description: 'User Id',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'placeType',
    description: 'Place type',
    required: true,
    type: getSavedPlaceDto['placeType'],
  })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async getSavedPlaces(
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Param('placeType') placeType: getSavedPlaceDto['placeType']
  ): Promise<Attraction[] | Restaurant[]> {
    return this.userService.getSavedPlaces(currentUser, id, placeType);
  }

  @Delete('me/saves/:placeType/:placeId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Saves place deleted successfully' })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @ApiParam({
    name: 'placeType',
    example: 'Restaurant',
    description: 'Type of the place (Restaurant or Attraction)',
  })
  @ApiParam({
    name: 'placeId',
    example: '65838511e76a894551c39d13',
    description: 'ID of the place to delete',
  })
  async deleteSavedPlace(
    @CurrentUser() currentUser,
    @Param('placeType') placeType: deleteSavedPlaceDto['placeType'],
    @Param('placeId') placeId: deleteSavedPlaceDto['placeId']
  ): Promise<{ savedRestaurants: Restaurant[] } | { savedAttractions: Attraction[] } | undefined> {
    const deleteSavedPlaceDto = { placeType, placeId };
    return this.userService.deleteSavedPlace(currentUser, deleteSavedPlaceDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    })
  )
  async updateProfile(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Multer.File
  ) {
    const updatedUserDto = plainToClass(UpdateUserDto, updateUserDto);
    return this.userService.updateUser(userId, updatedUserDto, avatar);
  }
}
