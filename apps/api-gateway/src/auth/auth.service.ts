import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import type { Observable } from 'rxjs';
import {
  AuthGrpcService,
  HealthResponse,
} from './interfaces/auth-grpc.interface.js';
import type { ClientGrpc } from '@nestjs/microservices';

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
}
