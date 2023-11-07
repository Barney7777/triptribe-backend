import { PartialType } from '@nestjs/mapped-types';
import { BaseUserDto, UserRole } from '@/user/dto/base-user.dto';
import { Exclude } from 'class-transformer';

export class AuthRegisterDto extends PartialType(BaseUserDto) {
  @Exclude()
  nickname: string;

  @Exclude()
  firstName: string;

  @Exclude()
  lastName: string;

  @Exclude()
  role: UserRole.USER;

  @Exclude()
  description: string;

  @Exclude()
  authToken: string;

  @Exclude()
  savedAttractions: object[];

  @Exclude()
  savedRestaurants: object[];
}
