import { Module } from '@nestjs/common';
import { AcceptController } from './accept.controller.js';
import { AccessService } from './accept.service.js';

@Module({
  imports: [],
  controllers: [AcceptController],
  providers: [AccessService],
})
export class AcceptModule {}
