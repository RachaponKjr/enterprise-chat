import type { CreateChannelResponse } from './interfaces/channel-grpc.interface.js';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateChannelDto } from './dto/channel/channel-create.dto.js';
import { firstValueFrom, timeout } from 'rxjs';
import { ChannelSerivce } from './channel.service.js';

@Controller(['channel', 'channnel'])
export class ChannelController {
  constructor(private readonly channelService: ChannelSerivce) {}
  //Channel Zone
  @Post('create')
  async createChannel(
    @Body() payload: CreateChannelDto,
  ): Promise<CreateChannelResponse> {
    return firstValueFrom(
      this.channelService.createChannel(payload).pipe(timeout(5000)),
    );
  }
}
