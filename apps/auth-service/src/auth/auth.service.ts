import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { RegisterUseCase } from './use-cases/register.use-case.js';

@Injectable()
export class AuthService {
  constructor(private readonly registerUseCase: RegisterUseCase,) {}

  registerUser(payload: RegisterDto) {
    return this.registerUseCase.execute(payload);
  }
}
