import { Observable } from 'rxjs';
import { CreateWorkspaceDto } from '../dto/create.dto.js';
import { GetWorkspaceByIdDto } from '../dto/workspace.dto.js';

export interface ProtoTimestamp {
  seconds: number;
  nanos: number;
}

export interface WorkspaceResponse {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: ProtoTimestamp;
  updated_at: ProtoTimestamp;
}

export type CreateWorkspaceResponse = WorkspaceResponse;

export interface ListWorkspacesRequest {
  page_size?: number;
  page_token?: string;
}

export interface ListWorkspacesResponse {
  workspaces: WorkspaceResponse[];
  next_page_token: string;
}

export interface WorkspaceGrpcService {
  createWorkspace(
    data: CreateWorkspaceDto,
  ): Observable<CreateWorkspaceResponse>;

  listWorkspaces(
    data: ListWorkspacesRequest,
  ): Observable<ListWorkspacesResponse>;

  getWorkspace(data: GetWorkspaceByIdDto): Observable<WorkspaceResponse>;
}
