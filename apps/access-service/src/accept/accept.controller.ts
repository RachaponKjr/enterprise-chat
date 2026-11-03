import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AccessService } from './accept.service.js';

@Controller()
export class AcceptController {
  private readonly logger = new Logger(AcceptController.name);

  constructor(private readonly accessService: AccessService) {}

  @GrpcMethod('AccessService', 'Health')
  health() {
    this.logger.log('Health RPC called');
    return {
      status: true,
      service: 'access-service',
    };
  }
}
