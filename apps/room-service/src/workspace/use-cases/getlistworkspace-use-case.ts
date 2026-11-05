import { Injectable, Logger } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { isUUID } from 'class-validator';
import { WorkspaceRepository } from '../repositories/workspace.repository.js';
import { GetWorkspaceByIdDto } from '../dto/workspace.dto.js';

export interface ListWorkspacesRequest {
  page_size?: number;
  page_token?: string;
}

function toTimestamp(date: Date) {
  const milliseconds = date.getTime();
  const seconds = Math.floor(milliseconds / 1000);

  return {
    seconds,
    nanos: (milliseconds - seconds * 1000) * 1_000_000,
  };
}

@Injectable()
export class ListWorkspacesUseCase {
  private readonly logger = new Logger(ListWorkspacesUseCase.name);

  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async execute(payload: ListWorkspacesRequest = {}) {
    // proto3 อาจส่ง 0 เมื่อไม่ได้ระบุ page_size
    const requestedSize = payload.page_size ?? 0;
    const pageSize = requestedSize === 0 ? 20 : requestedSize;
    const pageToken = payload.page_token ?? '';

    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'page_size ต้องเป็นจำนวนเต็มตั้งแต่ 1 ถึง 100',
      });
    }

    if (
      typeof pageToken !== 'string' ||
      (pageToken !== '' && !isUUID(pageToken))
    ) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'page_token ไม่ถูกต้อง',
      });
    }

    try {
      // user ID ชั่วคราวสำหรับทดสอบ
      const rows = await this.workspaceRepository.listWorkspaces(
        '1',
        pageSize,
        pageToken,
      );

      const hasNextPage = rows.length > pageSize;
      const items = rows.slice(0, pageSize);

      return {
        workspaces: items.map((workspace) => ({
          id: workspace.id,
          name: workspace.name,
          description: workspace.description,
          owner_id: workspace.ownerId,
          created_at: toTimestamp(workspace.createdAt),
          updated_at: toTimestamp(workspace.updatedAt),
        })),
        next_page_token: hasNextPage ? items[items.length - 1]!.id : '',
      };
    } catch (error) {
      this.logger.error(
        'Failed to list workspaces',
        error instanceof Error ? error.stack : undefined,
      );

      throw new RpcException({
        code: status.INTERNAL,
        message: 'ไม่สามารถโหลดรายการพื้นที่ทำงานได้',
      });
    }
  }

  async getById(payload: GetWorkspaceByIdDto) {
    const workspaceId = payload?.workspace_id;
    if (typeof workspaceId !== 'string' || !isUUID(workspaceId)) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'กรุณาระบุ ID WORKSPACE ที่เป็น UUID',
      });
    }

    try {
      const workspace = await this.workspaceRepository.getWorkspaceById(workspaceId);
      if (!workspace || workspace.deletedAt !== null) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'ไม่พบพื้นที่ทำงาน',
        });
      }

      return {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        owner_id: workspace.ownerId,
        created_at: toTimestamp(workspace.createdAt),
        updated_at: toTimestamp(workspace.updatedAt),
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      this.logger.error(
        'Failed to get workspace',
        error instanceof Error ? error.stack : undefined,
      );
      throw new RpcException({
        code: status.INTERNAL,
        message: 'ไม่สามารถโหลดพื้นที่ทำงานได้',
      });
    }
  }
}