import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import type { Observable } from 'rxjs';
import {
  AuthGrpcService,
  HealthResponse,
  RegisterResponse,
  ResendVerifyRespones,
  VerifyRespones,
} from './interfaces/auth-grpc.interface.js';
import { Payload, type ClientGrpc } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto.js';
import { ReVerifyEmailDto, VerifyEmailDto } from './dto/verify.dto.js';

@Injectable()
export class AuthService implements OnModuleInit {
  private grpcService!: AuthGrpcService;

  constructor(
    @Inject('AUTH_GRPC')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpcService = this.client.getService<AuthGrpcService>('AuthService');
  }

  health(): Observable<HealthResponse> {
    return this.grpcService.health({});
  }

  register(payload: RegisterDto): Observable<RegisterResponse> {
    return this.grpcService.register(payload);
  }

  verifyEmail(paylaod: VerifyEmailDto): Observable<VerifyRespones> {
    return this.grpcService.verifyEmail(paylaod);
  }

  resendVerifyEmail(
    payload: ReVerifyEmailDto,
  ): Observable<ResendVerifyRespones> {
    return this.grpcService.resendEmailVerification(payload);
  }

  login(@Payload() payload: any): Observable<void> {
    throw new Error('Login is not implemented');
  }
}
