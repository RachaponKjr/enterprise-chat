import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AcceptModule } from './accept/accept.module.js';
import { createObserveModule } from '@nestjs/observe';

export const { ObserveModule, ObserveInstrument } = createObserveModule();
@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'access-service',
    }),
    AcceptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
