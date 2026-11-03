import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import type { Observable } from 'rxjs';
import {
  AuthGrpcService,
  HealthResponse,
  RegisterResponse,
} from './interfaces/auth-grpc.interface.js';
import { Payload, type ClientGrpc } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto.js';

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

  login(@Payload() payload: any): Observable<void> {
    throw new Error('Login is not implemented');
  }
}
