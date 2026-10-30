import { Controller, Get } from '@nestjs/common';
import { firstValueFrom, timeout } from 'rxjs';
import { AuthService } from './auth.service.js';
import { HealthResponse } from './interfaces/auth-grpc.interface.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  async health(): Promise<HealthResponse> {
    return firstValueFrom(this.authService.health().pipe(timeout(5000)));
  }
}
