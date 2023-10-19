import { IsString, IsOptional, IsEnum, IsArray, IsEmail, IsStrongPassword } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  BUSINESS_OWNER = 'businessOwner',
}
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  //need to check unique in service or controller
  @IsString()
  nickname: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole.USER;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  authToken: string;

  @IsArray()
  @IsOptional()
  savedAttractions: object[];

  @IsArray()
  @IsOptional()
  savedRestaurants: object[];
}
