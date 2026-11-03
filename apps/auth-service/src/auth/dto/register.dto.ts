import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({
    message: 'กรุณากรอกอีเมล',
  })
  @IsEmail(
    {},
    {
      message: 'รูปแบบอีเมลไม่ถูกต้อง เช่น example@gmail.com',
    },
  )
  email!: string;

  @IsString({
    message: 'รหัสผ่านต้องเป็นข้อความ',
  })
  @IsNotEmpty({
    message: 'กรุณากรอกรหัสผ่าน',
  })
  @MinLength(12, {
    message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 12 ตัวอักษร',
  })
  @MaxLength(128, {
    message: 'รหัสผ่านต้องมีความยาวไม่เกิน 128 ตัวอักษร',
  })
  password!: string;

  @IsString({
    message: 'ชื่อผู้ใช้ต้องเป็นข้อความ',
  })
  @IsNotEmpty({
    message: 'กรุณากรอกชื่อผู้ใช้',
  })
  @MinLength(2, {
    message: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 2 ตัวอักษร',
  })
  @MaxLength(150, {
    message: 'ชื่อผู้ใช้ต้องมีความยาวไม่เกิน 150 ตัวอักษร',
  })
  displayName!: string;
}
