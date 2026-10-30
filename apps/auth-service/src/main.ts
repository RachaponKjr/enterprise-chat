import { NestFactory } from '@nestjs/core';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'node:path';

import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth.v1',
        protoPath: join(process.cwd(), '../../packages/proto/auth.proto'),
        url: '127.0.0.1:50051',
      },

      // Enable Observe instrumentation
      instrument: ObserveInstrument,
    },
  );

  await app.listen();

  console.log('Auth gRPC running on port 50051');
}

void bootstrap();
