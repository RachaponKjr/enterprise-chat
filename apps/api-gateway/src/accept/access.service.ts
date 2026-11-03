import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AccessGrpcService,
  AccessHealthResponse,
} from './interfaces/access-grpc.interface.js';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AccessService implements OnModuleInit {
  private grpcService!: AccessGrpcService;
  constructor(
    @Inject('ACCESS_GRPC')
    private readonly client: ClientGrpc,
  ) {}


  onModuleInit() {
    this.grpcService =
      this.client.getService<AccessGrpcService>('AccessService');
  }

  health(): Observable<AccessHealthResponse> {
    return this.grpcService.health({});
  }
}
