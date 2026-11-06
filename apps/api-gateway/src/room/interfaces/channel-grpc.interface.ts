import { Observable } from 'rxjs';
import { ProtoTimestamp } from './room-grpc.interface.js';
import { CreateChannelDto } from '../dto/channel/channel-create.dto.js';

import type {
  ChannelType,
  ChannelVisibility,
} from '../dto/channel/channel-create.dto.js';
import { ListChannelsReq } from '../dto/channel/get-channel.dto.js';

export interface CreateChannelResponse {
  id: string;
  workspace_id: string;
  category_id?: string;
  name: string;
  description: string;
  type: ChannelType;
  visibility: ChannelVisibility;
  position: number;
  created_by: string;
  created_at: ProtoTimestamp;
  updated_at: ProtoTimestamp;
}

export interface ListChannelsResponse {
  channels: CreateChannelResponse[];
  next_page_token: string;
}

export interface ChannelGrpcService {
  createChannel(data: CreateChannelDto): Observable<CreateChannelResponse>;
  listChannels(data: ListChannelsReq): Observable<ListChannelsResponse>;
}
