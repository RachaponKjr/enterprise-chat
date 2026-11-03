import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { AccessController } from './access.controller.js';
import { AccessService } from './access.service.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ACCESS_GRPC',
        transport: Transport.GRPC,
        options: {
          url: '127.0.0.1:50052',
          package: 'access.v1',
          protoPath: join(
            process.cwd(),
            '../../packages/proto/access/v1/access.proto',
          ),
        },
      },
    ]),
  ],
  controllers: [AccessController],
  providers: [AccessService],
})
export class AccessModule {}
