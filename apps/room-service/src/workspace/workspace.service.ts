import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create.dto.js';
import { CreateWorkspaceUseCase } from './use-cases/createworkspace-usecase.js';
import {
  ListWorkspacesRequest,
  ListWorkspacesUseCase,
} from './use-cases/getlistworkspace-use-case.js';
import { GetWorkspaceByIdDto } from './dto/workspace.dto.js';
import { CreateChannelDto } from './dto/channel/channel-create.dto.js';
import { ListChannelsReq } from './dto/channel/get-channel.dto.js';
import { ChannelUseCase } from './use-cases/channel-use-case.js';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
    private readonly listWorkspacesUseCase: ListWorkspacesUseCase,
    private readonly channelUseCase: ChannelUseCase,
  ) {}

  createWorkspace(payload: CreateWorkspaceDto) {
    return this.createWorkspaceUseCase.create(payload);
  }

  listWorkspaces(payload: ListWorkspacesRequest) {
    return this.listWorkspacesUseCase.execute(payload);
  }

  getWorkspaceById(payload: GetWorkspaceByIdDto) {
    return this.listWorkspacesUseCase.getById(payload);
  }

  listChannels(payload: ListChannelsReq) {
    return this.channelUseCase.getlist(payload);
  }

  //Channel Zone
  createChannel(payload: CreateChannelDto) {
    return this.channelUseCase.create(payload);
  }
}
