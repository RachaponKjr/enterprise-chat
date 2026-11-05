import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  NotEquals,
} from 'class-validator';

import { Type } from 'class-transformer';

// ตรงกับ enum ChannelType ใน .proto
export enum ChannelType {
  CHANNEL_TYPE_UNSPECIFIED = 0,
  CHANNEL_TYPE_TEXT = 1,
  CHANNEL_TYPE_VOICE = 2,
  CHANNEL_TYPE_ANNOUNCEMENT = 3,
}

// ตรงกับ enum ChannelVisibility ใน .proto
export enum ChannelVisibility {
  CHANNEL_VISIBILITY_UNSPECIFIED = 0,
  CHANNEL_VISIBILITY_PUBLIC = 1,
  CHANNEL_VISIBILITY_PRIVATE = 2,
}

export class CreateChannelDto {
  @IsNotEmpty({
    message: 'กรุณาระบุ Workspace ID',
  })
  @IsUUID('4', {
    message: 'Workspace ID ต้องเป็น UUID ที่ถูกต้อง',
  })
  workspace_id!: string;

  @IsOptional()
  @IsUUID('4', {
    message: 'Category ID ต้องเป็น UUID ที่ถูกต้อง',
  })
  category_id?: string;

  @IsNotEmpty({
    message: 'กรุณาระบุชื่อ Channel',
  })
  @IsString({
    message: 'ชื่อ Channel ต้องเป็นข้อความเท่านั้น',
  })
  @MinLength(4, {
    message: 'ชื่อ Channel ต้องมีอย่างน้อย 4 ตัวอักษร',
  })
  name!: string;

  @IsOptional()
  @IsString({
    message: 'คำอธิบายต้องเป็นข้อความเท่านั้น',
  })
  description?: string;

  @IsEnum(ChannelType, {
    message: 'ประเภท Channel ไม่ถูกต้อง',
  })
  @NotEquals(ChannelType.CHANNEL_TYPE_UNSPECIFIED, {
    message: 'กรุณาเลือกประเภท Channel',
  })
  type!: ChannelType;

  @IsEnum(ChannelVisibility, {
    message: 'การมองเห็น Channel ไม่ถูกต้อง',
  })
  @NotEquals(ChannelVisibility.CHANNEL_VISIBILITY_UNSPECIFIED, {
    message: 'กรุณาเลือกการมองเห็น Channel',
  })
  visibility!: ChannelVisibility;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'ตำแหน่งต้องเป็นจำนวนเต็มเท่านั้น',
  })
  @Min(0, {
    message: 'ตำแหน่งต้องไม่น้อยกว่า 0',
  })
  position: number = 0;
}
