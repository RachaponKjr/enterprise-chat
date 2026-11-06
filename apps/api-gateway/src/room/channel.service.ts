import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { CreateChannelDto } from './dto/channel/channel-create.dto.js';
import { Observable } from 'rxjs';
import {
  ChannelGrpcService,
  CreateChannelResponse,
  ListChannelsResponse,
} from './interfaces/channel-grpc.interface.js';
import { ListChannelsReq } from './dto/channel/get-channel.dto.js';

@Injectable()
export class ChannelSerivce implements OnModuleInit {
  private grpcService!: ChannelGrpcService;
  constructor(
    @Inject('WORKSPACE_GRPC')
    private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.grpcService =
      this.client.getService<ChannelGrpcService>('WorkspaceService');
  }

  createChannel(payload: CreateChannelDto): Observable<CreateChannelResponse> {
    return this.grpcService.createChannel(payload);
  }

  listChannels(payload: ListChannelsReq): Observable<ListChannelsResponse> {
    return this.grpcService.listChannels(payload);
  }
}
