import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_GRPC',
        transport: Transport.GRPC,
        options: {
          url: '127.0.0.1:50051',
          package: 'auth.v1',
          protoPath: join(process.cwd(), '../../packages/proto/auth.proto'),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
