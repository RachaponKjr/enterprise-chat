import { Body, Controller, Get, Post } from '@nestjs/common';
import { firstValueFrom, timeout } from 'rxjs';
import { AuthService } from './auth.service.js';
import {
  HealthResponse,
  RegisterResponse,
} from './interfaces/auth-grpc.interface.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  async health(): Promise<HealthResponse> {
    return firstValueFrom(this.authService.health().pipe(timeout(5000)));
  }

  @Post('register')
  async register(@Body() payload: RegisterDto): Promise<RegisterResponse> {
    return firstValueFrom(
      this.authService.register(payload).pipe(timeout(5000)),
    );
  }

  @Post('verify-email')
  async verifyEmail(@Body() payload: { token: string }): Promise<void> {
    throw new Error('Verify email is not implemented');
  }

  @Post('login')
  async login(@Body() payload: LoginDto): Promise<void> {
    throw new Error('Login is not implemented');
  }
}
