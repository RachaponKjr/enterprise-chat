import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class LoginDto {
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
  password!: string;
}
