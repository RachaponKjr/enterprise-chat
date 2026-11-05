import { Logger } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateWorkspaceDto } from '../dto/create.dto.js';
import { WorkspaceRepository } from '../repositories/workspace.repository.js';
import { CreateWorkspaceUseCase } from './createworkspace-usecase.js';

describe('CreateWorkspaceUseCase', () => {
  const createWorkspace = vi.fn();
  const useCase = new CreateWorkspaceUseCase({
    createWorkspace,
  } as unknown as WorkspaceRepository);

  beforeEach(() => {
    createWorkspace.mockReset();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('trims the name and returns protobuf timestamps', async () => {
    const date = new Date('2026-11-05T00:00:00.123Z');
    createWorkspace.mockResolvedValue({
      id: 'workspace-1',
      name: 'Team',
      description: '',
      ownerId: '1',
      createdAt: date,
      updatedAt: date,
    });
    const result = await useCase.create({ name: '  Team  ' });
    expect(createWorkspace).toHaveBeenCalledWith({
      name: 'Team',
      description: undefined,
    });
    expect(result).toEqual({
      id: 'workspace-1',
      name: 'Team',
      description: '',
      owner_id: '1',
      created_at: {
        seconds: Math.floor(date.getTime() / 1000),
        nanos: 123000000,
      },
      updated_at: {
        seconds: Math.floor(date.getTime() / 1000),
        nanos: 123000000,
      },
    });
  });

  it.each(['', '   ', 'abc'])(
    'rejects invalid name %j before accessing the database',
    async (name) => {
      const error = await useCase
        .create({ name })
        .catch((error: unknown) => error);
      expect(error).toBeInstanceOf(RpcException);
      expect((error as RpcException).getError()).toMatchObject({
        code: status.INVALID_ARGUMENT,
      });
      expect(createWorkspace).not.toHaveBeenCalled();
    },
  );

  it('does not expose database errors to the caller', async () => {
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    createWorkspace.mockRejectedValue(new Error('private database details'));
    const error = await useCase
      .create({ name: 'Team' })
      .catch((error: unknown) => error);
    expect((error as RpcException).getError()).toEqual({
      code: status.INTERNAL,
      message: 'ไม่สามารถสร้างพื้นที่ทำงานได้ กรุณาลองใหม่อีกครั้ง',
    });
  });

  it('requires a name in the DTO and validates after trimming', async () => {
    for (const input of [{}, { name: '   ' }, { name: ' abc ' }]) {
      expect(
        (await validate(plainToInstance(CreateWorkspaceDto, input))).length,
      ).toBeGreaterThan(0);
    }
    expect(
      await validate(plainToInstance(CreateWorkspaceDto, { name: ' Team ' })),
    ).toEqual([]);
  });
});
