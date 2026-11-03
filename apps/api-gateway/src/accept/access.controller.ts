import { Controller, Get } from '@nestjs/common';
import { firstValueFrom, timeout } from 'rxjs';
import { AccessHealthResponse } from './interfaces/access-grpc.interface.js';
import { AccessService } from './access.service.js';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get('health')
  health(): Promise<AccessHealthResponse> {
    return firstValueFrom(this.accessService.health().pipe(timeout(5000)));
  }
}
