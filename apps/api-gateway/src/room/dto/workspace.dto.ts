import { IsDefined, IsUUID } from 'class-validator';

export class GetWorkspaceByIdDto {
  @IsDefined({ message: 'กรุณาระบุ ID WORKSPACE' })
  @IsUUID('all', { message: 'ID WORKSPACE ต้องเป็น UUID ที่ถูกต้อง' })
  workspace_id: string;
}