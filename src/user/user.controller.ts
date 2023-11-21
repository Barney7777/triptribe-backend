import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { AllExceptionsFilter } from '@/utils/allExceptions.filter';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor(private readonly appService: UserService) {}

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
    return this.appService.findOne(id);
  }
}
