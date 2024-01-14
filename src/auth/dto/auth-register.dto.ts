import { BaseUserDto } from '@/user/dto/base-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRegisterDto extends BaseUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
