import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { AllExceptionsFilter } from '@/utils/allExceptions.filter';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/auth/CurrentUser.decorator';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('users')
@UseFilters(AllExceptionsFilter)
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
  @ApiOperation({ summary: 'Get an user', description: 'Retrieve an user successfully' })
  @ApiParam({
    name: 'id',
    description: 'User Id',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Retrieve an user by ID successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async find(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
}
