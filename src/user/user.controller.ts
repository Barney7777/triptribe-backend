import { Body, Controller, Get, Param, Post, UseGuards, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/auth/CurrentUser.decorator';
import { SavePlaceDto } from './dto/save-place.dto';

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
  create(@CurrentUser() currentUser, @Body() savePlaceDto: SavePlaceDto): Promise<void> {
    return this.userService.addSavedPlace(currentUser, savePlaceDto);
  }
}
