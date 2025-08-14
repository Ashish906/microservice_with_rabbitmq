import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenGuard } from '../../guards/refresh-token.guard';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  refreshToken(@Request() req: any) {
    return this.authService.refreshToken(req.user)
  }

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}
