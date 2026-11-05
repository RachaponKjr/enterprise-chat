import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateWorkspaceDto } from '../dto/create.dto.js';

@Injectable()
export class WorkspaceRepository {
  constructor(private readonly db: PrismaService) {}

  createWorkspace(payload: CreateWorkspaceDto) {
    return this.db.workspace.create({
      data: {
        name: payload.name,
        description: payload.description ?? '',
        // Temporary user ID for local testing until authentication is connected.
        ownerId: '1',
        createdBy: '1',
      },
    });
  }

  listWorkspaces(ownerId: string, pageSize: number, pageToken: string) {
    return this.db.workspace.findMany({
      where: {
        ownerId,
        deletedAt: null,
        ...(pageToken ? { id: { gt: pageToken } } : {}),
      },
      orderBy: {
        id: 'asc',
      },
      // อ่านเพิ่มหนึ่งรายการเพื่อตรวจว่ายังมีหน้าถัดไปไหม
      take: pageSize + 1,
    });
  }

  getWorkspaceById(workspace_id: string) {
    return this.db.workspace.findUnique({
      where: { id: workspace_id },
    });
  }
}
