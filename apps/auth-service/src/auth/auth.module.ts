import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { RegisterUseCase } from './use-cases/register.use-case.js';
import { UserRepository } from './repositories/user.repository.js';
import { HashService } from '../common/hash.service.js';
import { TokenService } from './repositories/token.repository.js';
import { EmailService } from '../email/email.service.js';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterUseCase,
    UserRepository,
    HashService,
    TokenService,
    EmailService
  ],
})
export class AuthModule {}
