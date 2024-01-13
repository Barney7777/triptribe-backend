import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { plainToClass } from 'class-transformer';
import { CurrentUser } from './CurrentUser.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register',
    description: 'Register an user account successfully',
  })
  @ApiBody({
    description: 'User account to register',
    schema: {
      type: 'object',
      required: ['email', 'password', 'firstName', 'lastName'],
      properties: {
        email: { type: 'string', example: 'do222@om141ai5l1.com' },
        password: { type: 'string', example: 'Abc12345+' },
        firstName: { type: 'string', example: 'David' },
        lastName: { type: 'string', example: 'Beckham' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Register an user account successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @Post('register')
  register(@Body() authRegisterDto: AuthRegisterDto) {
    const registerData = plainToClass(AuthRegisterDto, authRegisterDto);
    return this.authService.register(registerData);
  }

  @ApiOperation({
    summary: 'Login',
    description: 'Login an user account successfully',
  })
  @ApiBody({
    description: 'User account to login',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'triptribeuser@triptribe.com' },
        password: { type: 'string', example: 'Abc123456+' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Login an user account successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Refresh Token successfully',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Token to refresh',
  })
  @ApiResponse({ status: 201, description: 'Refresh Token successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('refreshToken')
  refreshToken(@Body() params: RefreshTokenDto) {
    return this.authService.refreshToken(params.refreshToken);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reset Password',
    description: 'Reset Password successfully',
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'New Password to reset',
  })
  @ApiResponse({ status: 201, description: 'Reset Password successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('password')
  @UseGuards(AuthGuard('jwt'))
  async resetPassword(@CurrentUser() currentUser, @Body() newPassword: ResetPasswordDto) {
    const userId = currentUser._id;
    return await this.authService.resetPassword(userId, newPassword);
  }
}
