import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    
    res.cookie('jwt_refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      message: 'Logged in successfully',
      access_token: result.accessToken,
    };
  }

  @Public()
  @Post('create-admin')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() adminData: any) {
    const result = await this.authService.createAdmin(adminData);
    return {
      message: 'Admin created successfully',
      user: result,
    };
  }
}