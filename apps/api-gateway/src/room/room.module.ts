import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { WorkspaceSerivce } from './room.service.js';
import { WorkspaceController } from './room.controller.js';
import { ChannelController } from './channel.controller.js';
import { ChannelSerivce } from './channel.service.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WORKSPACE_GRPC',
        transport: Transport.GRPC,
        options: {
          url: '127.0.0.1:50053',
          package: 'room.v1',
          loader: {
            keepCase: true,
            longs: Number,
            defaults: true,
          },
          protoPath: join(
            process.cwd(),
            '../../packages/proto/room/v1/room.proto',
          ),
        },
      },
    ]),
  ],
  providers: [WorkspaceSerivce, ChannelSerivce],
  controllers: [WorkspaceController, ChannelController],
  exports: [WorkspaceSerivce, ChannelSerivce],
})
export class WorkspaceModule {}
