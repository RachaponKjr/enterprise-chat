import { Injectable, Logger } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { CreateWorkspaceDto } from '../dto/create.dto.js';
import { WorkspaceRepository } from '../repositories/workspace.repository.js';
import { toTimestamp } from '../../util/format.js';

@Injectable()
export class CreateWorkspaceUseCase {
  private readonly logger = new Logger(CreateWorkspaceUseCase.name);

  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async create(payload: CreateWorkspaceDto) {
    const name = typeof payload?.name === 'string' ? payload.name.trim() : '';
    if (name.length < 4) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: name ? 'ชื่อต้องมีความยาวมากกว่า 3 ตัวอักษร' : 'กรุณาใส่ชื่อ',
      });
    }
    if (
      payload.description != null &&
      typeof payload.description !== 'string'
    ) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'คำอธิบายต้องเป็นข้อความเท่านั้น',
      });
    }

    try {
      const workspace = await this.workspaceRepository.createWorkspace({
        name,
        description: payload.description,
      });

      return {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        owner_id: workspace.ownerId,
        created_at: toTimestamp(workspace.createdAt),
        updated_at: toTimestamp(workspace.updatedAt),
      };
    } catch (error) {
      this.logger.error(
        'Failed to create workspace',
        error instanceof Error ? error.stack : undefined,
      );
      throw new RpcException({
        code: status.INTERNAL,
        message: 'ไม่สามารถสร้างพื้นที่ทำงานได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  }
}
