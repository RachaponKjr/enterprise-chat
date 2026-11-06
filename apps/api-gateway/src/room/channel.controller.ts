import type {
  CreateChannelResponse,
  ListChannelsResponse,
} from './interfaces/channel-grpc.interface.js';
import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/channel/channel-create.dto.js';
import { firstValueFrom, timeout } from 'rxjs';
import { ChannelSerivce } from './channel.service.js';
import { ListChannelsReq } from './dto/channel/get-channel.dto.js';

@Controller(['channel'])
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

  @Get('list')
  async getChannels(
    @Query('workspace_id') workspaceId: string,
    @Query('category_id') categoryId: string | undefined,
    @Query('page_size', new DefaultValuePipe(20), ParseIntPipe)
    pageSize: number,
    @Query('page_token', new DefaultValuePipe('')) pageToken: string,
    @Query('uncategorized_only', new DefaultValuePipe(false), ParseBoolPipe)
    uncategorizedOnly: boolean,
  ): Promise<ListChannelsResponse> {
    const payload: ListChannelsReq = {
      workspace_id: workspaceId,
      ...(categoryId !== undefined ? { category_id: categoryId } : {}),
      page_size: pageSize,
      page_token: pageToken,
      uncategorized_only: uncategorizedOnly,
    };

    return firstValueFrom(
      this.channelService.listChannels(payload).pipe(timeout(5000)),
    );
  }
}
