import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { ZodValidationPipe } from '../pipe/validation.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get(':id')
  async find(@Param('id') id: string): Promise<User> {
    return this.appService.findOne(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto): Promise<User | undefined> {
    return this.appService.create(createUserDto);
  }
}
