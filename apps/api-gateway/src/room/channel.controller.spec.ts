import type { ClientGrpc } from '@nestjs/microservices';
import { of } from 'rxjs';
import { ChannelController } from './channel.controller.js';
import { ChannelSerivce } from './channel.service.js';

describe('Channel list gateway', () => {
  it('forwards GET parameters to the ListChannels RPC and returns its response', async () => {
    const response = { channels: [], next_page_token: '' };
    const listChannels = vi.fn().mockReturnValue(of(response));
    const getService = vi.fn().mockReturnValue({ listChannels });
    const service = new ChannelSerivce({ getService } as unknown as ClientGrpc);
    service.onModuleInit();
    const controller = new ChannelController(service);
    expect(
      await controller.getChannels('workspace-1', undefined, 20, '', true),
    ).toEqual(response);
    expect(getService).toHaveBeenCalledWith('WorkspaceService');
    expect(listChannels).toHaveBeenCalledWith({
      workspace_id: 'workspace-1',
      page_size: 20,
      page_token: '',
      uncategorized_only: true,
    });
  });
});
