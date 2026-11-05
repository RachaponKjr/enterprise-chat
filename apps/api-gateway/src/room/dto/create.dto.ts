import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsOptional()
  @IsString({
    message: 'ชื่อต้องเป็นข้อความเท่านั้น',
  })
  @MinLength(4, {
    message: 'ชื่อต้องมีความยาวมากกว่า 3 ตัวอักษร',
  })
  name?: string;

  @IsOptional()
  @IsString({
    message: 'คำอธิบายต้องเป็นข้อความเท่านั้น',
  })
  description?: string;
}
