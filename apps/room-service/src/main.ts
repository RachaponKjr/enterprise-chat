import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { join } from 'node:path';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'room.v1',
        loader: { keepCase: true },
        protoPath: join(
          process.cwd(),
          '../../packages/proto/room/v1/room.proto',
        ),
        url: '127.0.0.1:50053',
      },

      instrument: ObserveInstrument,
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new RpcException({
          code: status.INVALID_ARGUMENT,
          message:
            errors
              .flatMap((error) => Object.values(error.constraints ?? {}))
              .join(', ') || 'ข้อมูลไม่ถูกต้อง',
        }),
    }),
  );

  await app.listen();

  console.log('Room gRPC running on port 50053');
}
await bootstrap();
