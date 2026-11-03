import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { UserRepository } from '../repositories/user.repository.js';
import { RegisterDto } from '../dto/register.dto.js';
import { HashService } from '../../common/hash.service.js';
import { TokenService } from '../repositories/token.repository.js';
import { EmailService } from '../../email/email.service.js';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async execute(payload: RegisterDto) {
    const email = payload.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'อีเมลนี้ถูกใช้งานแล้ว',
      });
    }

    const passwordHash = await this.hashService.hashPassword(payload.password);

    const user = await this.userRepository.create({
      email,
      displayName: payload.displayName.trim(),
      passwordHash,
    });

    if (!user) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
      });
    }

    const tokenHash = this.tokenService.setSecurityToken(
      user.id,
      'EMAIL_VERIFICATION',
    );

    await this.emailService.sendVerificationEmail(email, (await tokenHash).token);

    return {
      userId: user.id,
      message: 'สมัครสมาชิกสำเร็จ กรุณายืนยันอีเมล',
      emailVerificationRequired: true,
    };
  }
}
