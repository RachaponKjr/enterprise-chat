import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { firstValueFrom, timeout } from 'rxjs';
import {
  CreateWorkspaceResponse,
  ListWorkspacesResponse,
  WorkspaceResponse,
} from './interfaces/room-grpc.interface.js';
import { WorkspaceSerivce } from './room.service.js';
import { CreateWorkspaceDto } from './dto/create.dto.js';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceSerivce) {}

  @Post('create')
  async createWorkspace(
    @Body() payload: CreateWorkspaceDto,
  ): Promise<CreateWorkspaceResponse> {
    return firstValueFrom(
      this.workspaceService.createWorkespace(payload).pipe(timeout(5000)),
    );
  }

  @Get('list')
  async listWorkspaces(
    @Query('page_size', new DefaultValuePipe(20), ParseIntPipe)
    pageSize: number,

    @Query('page_token', new DefaultValuePipe(''))
    pageToken: string,
  ): Promise<ListWorkspacesResponse> {
    return firstValueFrom(
      this.workspaceService
        .listWorkspaces({
          page_size: pageSize,
          page_token: pageToken,
        })
        .pipe(timeout(5000)),
    );
  }

  @Get('list/:id')
  async workspacesById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<WorkspaceResponse> {
    return firstValueFrom(
      this.workspaceService
        .getWorkspaceById({ workspace_id: id })
        .pipe(timeout(5000)),
    );
  }


}
