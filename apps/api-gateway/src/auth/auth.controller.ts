import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { status } from '@grpc/grpc-js';
import { AuthService } from './auth.service.js';
import {
  HealthResponse,
  RegisterResponse,
} from './interfaces/auth-grpc.interface.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ReVerifyEmailDto } from './dto/verify.dto.js';

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

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') verificationToken: string) {
    try {
      return await firstValueFrom(
        this.authService.verifyEmail({ verificationToken }).pipe(timeout(5000)),
      );
    } catch (error: unknown) {
      const rpcError = error as { code?: number; details?: string } | null;
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let code = 'EMAIL_VERIFICATION_FAILED';
      let message = 'เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่ภายหลัง';

      switch (rpcError?.code) {
        case status.INVALID_ARGUMENT:
          statusCode = HttpStatus.BAD_REQUEST;
          code = 'VERIFICATION_TOKEN_INVALID';
          message = rpcError.details || 'Verification Token ไม่ถูกต้อง';
          break;
        case status.ALREADY_EXISTS:
          statusCode = HttpStatus.CONFLICT;
          code = 'VERIFICATION_TOKEN_USED';
          message = 'Verification Token ถูกใช้งานแล้ว';
          break;
        case status.OUT_OF_RANGE:
          statusCode = HttpStatus.GONE;
          code = 'VERIFICATION_TOKEN_EXPIRED';
          message = 'Verification Token หมดอายุแล้ว';
          break;
        case status.FAILED_PRECONDITION:
          statusCode = HttpStatus.CONFLICT;
          code = 'VERIFICATION_TOKEN_UNAVAILABLE';
          message = 'Verification Token ไม่สามารถใช้งานได้';
          break;
        case status.UNAVAILABLE:
          statusCode = HttpStatus.SERVICE_UNAVAILABLE;
          code = 'AUTH_SERVICE_UNAVAILABLE';
          message = 'ไม่สามารถติดต่อระบบยืนยันอีเมลได้ กรุณาลองใหม่ภายหลัง';
          break;
      }

      if (
        error instanceof TimeoutError ||
        rpcError?.code === status.DEADLINE_EXCEEDED
      ) {
        statusCode = HttpStatus.GATEWAY_TIMEOUT;
        code = 'AUTH_SERVICE_TIMEOUT';
        message = 'ระบบยืนยันอีเมลใช้เวลาตอบกลับนานเกินไป';
      }
      throw new HttpException({ statusCode, code, message }, statusCode);
    }
  }

  @Post('/resend-verify-email')
  async resendVerifyEmail(@Body() payload: ReVerifyEmailDto) {
    return await firstValueFrom(this.authService.resendVerifyEmail(payload))
  }

  @Post('login')
  async login(@Body() payload: LoginDto): Promise<void> {
    throw new Error('Login is not implemented');
  }
}
