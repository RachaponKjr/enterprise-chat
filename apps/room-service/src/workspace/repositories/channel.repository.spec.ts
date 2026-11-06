import { ChannelRepository } from './channel.repository.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ListChannelsReq } from '../dto/channel/get-channel.dto.js';

describe('ChannelRepository list filters', () => {
  it.each([
    [{}, {}],
    [{ category_id: 'category-1' }, { categoryId: 'category-1' }],
    [{ uncategorized_only: true }, { categoryId: null }],
  ])(
    'scopes channels to active rows in the workspace: %j',
    async (filter, where) => {
      const findMany = vi.fn().mockResolvedValue([]);
      const repository = new ChannelRepository({
        channel: { findMany },
      } as unknown as PrismaService);
      await repository.listChannels(
        Object.assign(new ListChannelsReq(), {
          workspace_id: 'workspace-1',
          page_token: 'cursor',
          ...filter,
        }),
        20,
      );
      expect(findMany).toHaveBeenCalledWith({
        where: {
          workspaceId: 'workspace-1',
          deletedAt: null,
          id: { gt: 'cursor' },
          ...where,
        },
        orderBy: { id: 'asc' },
        take: 21,
      });
    },
  );
});
