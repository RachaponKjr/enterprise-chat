import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Prisma, type Channel } from '#prisma';
import { plainToInstance } from 'class-transformer';
import { validate, isUUID } from 'class-validator';
import {
  CreateChannelDto,
  ChannelType,
  ChannelVisibility,
} from '../dto/channel/channel-create.dto.js';
import { ChannelRepository } from '../repositories/channel.repository.js';
import { ListChannelsReq } from '../dto/channel/get-channel.dto.js';

function toTimestamp(date: Date) {
  const milliseconds = date.getTime();
  const seconds = Math.floor(milliseconds / 1000);
  return { seconds, nanos: (milliseconds - seconds * 1000) * 1_000_000 };
}

function toChannelResponse(channel: Channel) {
  return {
    id: channel.id,
    workspace_id: channel.workspaceId,
    ...(channel.categoryId ? { category_id: channel.categoryId } : {}),
    name: channel.name,
    description: channel.description,
    type: ChannelType[channel.type],
    visibility: ChannelVisibility[channel.visibility],
    position: channel.position,
    created_by: channel.createdBy,
    created_at: toTimestamp(channel.createdAt),
    updated_at: toTimestamp(channel.updatedAt),
  };
}

@Injectable()
export class ChannelUseCase {
  private readonly logger = new Logger(ChannelUseCase.name);

  constructor(private readonly channelRepository: ChannelRepository) {}

  async create(payload: CreateChannelDto) {
    const input = plainToInstance(CreateChannelDto, {
      ...payload,
      name:
        typeof payload?.name === 'string' ? payload.name.trim() : payload?.name,
    });
    const errors = await validate(input);
    if (errors.length) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: errors
          .flatMap((error) => Object.values(error.constraints ?? {}))
          .join(', '),
      });
    }

    try {
      if (!(await this.channelRepository.findWorkspace(input.workspace_id))) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'ไม่พบพื้นที่ทำงาน',
        });
      }
      if (
        input.category_id &&
        !(await this.channelRepository.findCategory(
          input.category_id,
          input.workspace_id,
        ))
      ) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'ไม่พบหมวดหมู่ในพื้นที่ทำงานนี้',
        });
      }

      const channel = await this.channelRepository.createChannel(input);
      return toChannelResponse(channel);
    } catch (error) {
      if (error instanceof RpcException) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new RpcException({
          code: status.FAILED_PRECONDITION,
          message: 'Workspace หรือ Category ที่อ้างอิงไม่พร้อมใช้งาน',
        });
      }
      this.logger.error(
        'Failed to create channel',
        error instanceof Error ? error.stack : undefined,
      );
      throw new RpcException({
        code: status.INTERNAL,
        message: 'ไม่สามารถสร้าง Channel ได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  }

  async getlist(payload: ListChannelsReq) {
    const input = plainToInstance(ListChannelsReq, { ...payload });
    const errors = await validate(input);
    if (errors.length) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: errors
          .flatMap((error) => Object.values(error.constraints ?? {}))
          .join(', '),
      });
    }

    const pageSize = input.page_size === 0 ? 20 : input.page_size;
    if (pageSize > 100) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'page_size ต้องเป็นจำนวนเต็มตั้งแต่ 1 ถึง 100',
      });
    }
    if (input.page_token && !isUUID(input.page_token)) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'page_token ไม่ถูกต้อง',
      });
    }
    if (input.category_id && input.uncategorized_only) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'ไม่สามารถระบุ category_id พร้อมกับ uncategorized_only ได้',
      });
    }

    try {
      if (!(await this.channelRepository.findWorkspace(input.workspace_id))) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'ไม่พบพื้นที่ทำงาน',
        });
      }
      if (
        input.category_id &&
        !(await this.channelRepository.findCategory(
          input.category_id,
          input.workspace_id,
        ))
      ) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'ไม่พบหมวดหมู่ในพื้นที่ทำงานนี้',
        });
      }
      const rows = await this.channelRepository.listChannels(input, pageSize);
      const items = rows.slice(0, pageSize);
      return {
        channels: items.map(toChannelResponse),
        next_page_token:
          rows.length > pageSize ? items[items.length - 1]!.id : '',
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;
      this.logger.error(
        'Failed to list channels',
        error instanceof Error ? error.stack : undefined,
      );
      throw new RpcException({
        code: status.INTERNAL,
        message: 'ไม่สามารถโหลดรายการ Channel ได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  }
}
