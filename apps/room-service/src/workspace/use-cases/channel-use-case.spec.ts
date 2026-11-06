import { Logger } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { ChannelRepository } from '../repositories/channel.repository.js';
import { ListChannelsReq } from '../dto/channel/get-channel.dto.js';
import { ChannelUseCase } from './channel-use-case.js';

const date = new Date('2026-11-06T00:00:00.123Z');
const channel = {
  id: '123e4567-e89b-42d3-a456-426614174000',
  workspaceId: 'workspace-1',
  categoryId: null,
  name: 'general',
  description: '',
  type: 'CHANNEL_TYPE_TEXT',
  visibility: 'CHANNEL_VISIBILITY_PUBLIC',
  position: 0,
  createdBy: '1',
  createdAt: date,
  updatedAt: date,
};

describe('ChannelUseCase list', () => {
  const repository = {
    findWorkspace: vi.fn(),
    findCategory: vi.fn(),
    listChannels: vi.fn(),
  };
  const useCase = new ChannelUseCase(
    repository as unknown as ChannelRepository,
  );
  const request = (overrides = {}) =>
    Object.assign(
      new ListChannelsReq(),
      { workspace_id: 'workspace-1' },
      overrides,
    );
  beforeEach(() => {
    vi.resetAllMocks();
    repository.findWorkspace.mockResolvedValue({ id: 'workspace-1' });
    repository.findCategory.mockResolvedValue({ id: 'category-1' });
    repository.listChannels.mockResolvedValue([]);
  });
  afterEach(() => vi.restoreAllMocks());

  it('defaults to 20 and returns an empty final page', async () => {
    expect(await useCase.getlist(request())).toEqual({
      channels: [],
      next_page_token: '',
    });
    expect(repository.listChannels).toHaveBeenCalledWith(request(), 20);
  });
  it('returns a continuation token only when another row exists and maps protobuf fields', async () => {
    repository.listChannels.mockResolvedValue([
      channel,
      { ...channel, id: 'next' },
    ]);
    const result = await useCase.getlist(request({ page_size: 1 }));
    expect(result.next_page_token).toBe(channel.id);
    expect(result.channels).toHaveLength(1);
    expect(result.channels[0]).toMatchObject({
      workspace_id: 'workspace-1',
      type: 1,
      visibility: 1,
      created_at: { nanos: 123000000 },
    });
    expect(result.channels[0]).not.toHaveProperty('category_id');
    repository.listChannels.mockResolvedValue([channel]);
    expect(
      (await useCase.getlist(request({ page_size: 1 }))).next_page_token,
    ).toBe('');
  });
  it.each([
    { workspace_id: '' },
    { page_size: -1 },
    { page_size: 101 },
    { page_size: 1.5 },
    { page_token: 'invalid' },
    { uncategorized_only: 'false' },
    { category_id: 'category-1', uncategorized_only: true },
  ])('rejects invalid input %j before database access', async (input) => {
    const error = await useCase
      .getlist(request(input))
      .catch((error: RpcException) => error);
    expect(error).toBeInstanceOf(RpcException);
    expect((error as RpcException).getError()).toMatchObject({
      code: status.INVALID_ARGUMENT,
    });
    expect(repository.findWorkspace).not.toHaveBeenCalled();
  });
  it('rejects a missing workspace', async () => {
    repository.findWorkspace.mockResolvedValue(null);
    await expect(useCase.getlist(request())).rejects.toMatchObject({
      error: { code: status.NOT_FOUND },
    });
    expect(repository.listChannels).not.toHaveBeenCalled();
  });
  it('rejects a category outside the workspace', async () => {
    repository.findCategory.mockResolvedValue(null);
    await expect(
      useCase.getlist(request({ category_id: 'other' })),
    ).rejects.toMatchObject({ error: { code: status.INVALID_ARGUMENT } });
    expect(repository.findCategory).toHaveBeenCalledWith(
      'other',
      'workspace-1',
    );
    expect(repository.listChannels).not.toHaveBeenCalled();
  });
  it('hides database errors', async () => {
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    repository.listChannels.mockRejectedValue(new Error('secret'));
    const error = await useCase
      .getlist(request())
      .catch((error: RpcException) => error);
    expect((error as RpcException).getError()).toMatchObject({
      code: status.INTERNAL,
    });
    expect(JSON.stringify((error as RpcException).getError())).not.toContain(
      'secret',
    );
  });
});
