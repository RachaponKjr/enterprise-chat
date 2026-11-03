import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule, ObserveInstrument } from './app.module.js';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'access.v1',
      protoPath: join(
        process.cwd(),
        '../../packages/proto/access/v1/access.proto',
      ),
      url: '127.0.0.1:50052',
    },
    instrument: ObserveInstrument,
  });

  await app.listen();

  console.log('Auth gRPC running on port 50052');
}

bootstrap();
