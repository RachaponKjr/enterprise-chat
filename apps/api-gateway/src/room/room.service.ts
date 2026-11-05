import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateWorkspaceResponse,
  ListWorkspacesRequest,
  ListWorkspacesResponse,
  WorkspaceGrpcService,
  WorkspaceResponse,
} from './interfaces/room-grpc.interface.js';
import { type ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateWorkspaceDto } from './dto/create.dto.js';
import { GetWorkspaceByIdDto } from './dto/workspace.dto.js';

@Injectable()
export class WorkspaceSerivce implements OnModuleInit {
  private grpcService!: WorkspaceGrpcService;

  constructor(
    @Inject('WORKSPACE_GRPC')
    private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.grpcService =
      this.client.getService<WorkspaceGrpcService>('WorkspaceService');
  }

  createWorkespace(
    payload: CreateWorkspaceDto,
  ): Observable<CreateWorkspaceResponse> {
    return this.grpcService.createWorkspace(payload);
  }

  listWorkspaces(
    payload: ListWorkspacesRequest,
  ): Observable<ListWorkspacesResponse> {
    return this.grpcService.listWorkspaces(payload);
  }

  getWorkspaceById(
    payload: GetWorkspaceByIdDto,
  ): Observable<WorkspaceResponse> {
    return this.grpcService.getWorkspace(payload);
  }
}
