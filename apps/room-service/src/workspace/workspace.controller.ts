import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateWorkspaceDto } from './dto/create.dto.js';
import { WorkspaceService } from './workspace.service.js';
import type { ListWorkspacesRequest } from './use-cases/getlistworkspace-use-case.js';
import { GetWorkspaceByIdDto } from './dto/workspace.dto.js';
import { CreateChannelDto } from './dto/channel/channel-create.dto.js';

@Controller()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @GrpcMethod('WorkspaceService', 'CreateWorkspace')
  createWorkspace(payload: CreateWorkspaceDto) {
    return this.workspaceService.createWorkspace(payload);
  }

  @GrpcMethod('WorkspaceService', 'ListWorkspaces')
  listWorkspaces(payload: ListWorkspacesRequest) {
    return this.workspaceService.listWorkspaces(payload);
  }

  @GrpcMethod('WorkspaceService', 'GetWorkspace')
  getWorkspace(payload: GetWorkspaceByIdDto) {
    return this.workspaceService.getWorkspaceById(payload);
  }

  //Channel Zone
  @GrpcMethod('WorkspaceService', 'CreateChannel')
  createChannel(payload: CreateChannelDto) {
    return this.workspaceService.createChannel(payload);
  }
}
