import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { AllExceptionsFilter } from '@/utils/allExceptions.filter';

@Controller('user')
@UseFilters(AllExceptionsFilter)
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get(':id')
  async find(@Param('id') id: string): Promise<User> {
    return this.appService.findOne(id);
  }
}
