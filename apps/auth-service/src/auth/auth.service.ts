import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { RegisterUseCase } from './use-cases/register.use-case.js';
import { VerifyEmailUseCase } from './use-cases/verify.use-case.js';
import { ReVerifyEmailDto, VerifyEmailDto } from './dto/verify.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  registerUser(payload: RegisterDto) {
    return this.registerUseCase.execute(payload);
  }
  verifyEmail(payload: VerifyEmailDto) {
    return this.verifyEmailUseCase.execute(payload);
  }

  resendVerifyEmail(payload: ReVerifyEmailDto) {
    return this.verifyEmailUseCase.resend(payload);
  }
}
