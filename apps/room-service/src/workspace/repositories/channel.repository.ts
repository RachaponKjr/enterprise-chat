import { ListChannelsReq } from '../dto/channel/get-channel.dto.js';
import { Injectable } from '@nestjs/common';
import {
  ChannelType as DbChannelType,
  ChannelVisibility as DbChannelVisibility,
} from '#prisma';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateChannelDto,
  ChannelType,
  ChannelVisibility,
} from '../dto/channel/channel-create.dto.js';

@Injectable()
export class ChannelRepository {
  constructor(private readonly db: PrismaService) {}

  findWorkspace(id: string) {
    return this.db.workspace.findFirst({ where: { id, deletedAt: null } });
  }

  findCategory(id: string, workspaceId: string) {
    return this.db.category.findFirst({ where: { id, workspaceId } });
  }

  listChannels(payload: ListChannelsReq, pageSize: number) {
    return this.db.channel.findMany({
      where: {
        workspaceId: payload.workspace_id,
        deletedAt: null,
        ...(payload.uncategorized_only
          ? { categoryId: null }
          : payload.category_id
            ? { categoryId: payload.category_id }
            : {}),
        ...(payload.page_token ? { id: { gt: payload.page_token } } : {}),
      },
      orderBy: { id: 'asc' },
      take: pageSize + 1,
    });
  }

  createChannel(payload: CreateChannelDto) {
    return this.db.channel.create({
      data: {
        workspaceId: payload.workspace_id,
        categoryId: payload.category_id ?? null,
        name: payload.name,
        description: payload.description ?? '',
        type: DbChannelType[
          ChannelType[payload.type] as keyof typeof DbChannelType
        ],
        visibility:
          DbChannelVisibility[
            ChannelVisibility[
              payload.visibility
            ] as keyof typeof DbChannelVisibility
          ],
        position: payload.position ?? 0,
        createdBy: '1',
      },
    });
  }
}
