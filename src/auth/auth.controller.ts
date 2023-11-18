import { Controller, Get, Post, Body, UseGuards, Req, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { plainToClass } from 'class-transformer';
import { AllExceptionsFilter } from '@/utils/allExceptions.filter';
import { CurrentUser } from './CurrentUser.decorator';
import { EditPasswordDto } from './dto/edit-password.dto';

@Controller({
  path: 'auth',
  version: '1',
})
@UseFilters(AllExceptionsFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() authRegisterDto: AuthRegisterDto) {
    const registerData = plainToClass(AuthRegisterDto, authRegisterDto);
    return this.authService.register(registerData);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('userinfo')
  @UseGuards(AuthGuard('jwt'))
  getMeInfo(@Req() req) {
    return this.authService.getMeInfo(req.user);
  }

  @Post('refreshToken')
  refreshToken(@Body() params: RefreshTokenDto) {
    return this.authService.refreshToken(params.refreshToken);
  }


  @Post("password")
  @UseGuards(AuthGuard('jwt'))
  async editPassword(@CurrentUser() currentUser, @Body() newPassword: EditPasswordDto) {
    const userId = currentUser._id
    return await this.authService.editPassword(userId, newPassword);
  }
}
