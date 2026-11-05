import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { WorkspaceController } from './workspace.controller.js';
import { WorkspaceService } from './workspace.service.js';
import { WorkspaceRepository } from './repositories/workspace.repository.js';
import { CreateWorkspaceUseCase } from './use-cases/createworkspace-usecase.js';
import { ListWorkspacesUseCase } from './use-cases/getlistworkspace-use-case.js';
import { ChannelUseCase } from './use-cases/channel-use-case.js';
import { ChannelRepository } from './repositories/channel.repository.js';

@Module({
  imports: [PrismaModule],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceRepository,
    ChannelRepository,
    CreateWorkspaceUseCase,
    ListWorkspacesUseCase,
    ChannelUseCase,
  ],
})
export class WorkspaceModule {}
