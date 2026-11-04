import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณาส่ง Token' })
  verificationToken: string;
}

export class ReVerifyEmailDto {
  @IsEmail()
  @IsNotEmpty({ message: 'กรุณากรอก email' })
  email: string;
}
