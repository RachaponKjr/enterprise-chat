import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { VerifyEmailRepository } from '../repositories/verify-email.repository.js';
import { ReVerifyEmailDto, VerifyEmailDto } from '../dto/verify.dto.js';
import { TokenService } from '../repositories/token.repository.js';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly verifyRepository: VerifyEmailRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(payload: VerifyEmailDto) {
    const verificationToken = payload?.verificationToken;

    if (typeof verificationToken !== 'string' || !verificationToken.trim()) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'กรุณาระบุ Verification Token',
      });
    }

    const existingToken = await this.verifyRepository.checkToken(
      verificationToken,
      'EMAIL_VERIFICATION',
    );

    if (!existingToken) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Verification Token ไม่ถูกต้อง',
      });
    }

    if (existingToken.consumedAt) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'Verification Token ถูกใช้งานแล้ว',
      });
    }

    if (new Date(existingToken.expiresAt) <= new Date()) {
      throw new RpcException({
        code: status.OUT_OF_RANGE,
        message: 'Verification Token หมดอายุแล้ว',
      });
    }

    await this.verifyRepository.completeVerification(
      existingToken.id,
      existingToken.userId,
    );

    return {
      success: true,
      message: 'ยืนยันอีเมลเรียบร้อยแล้ว',
    };
  }

  async resend(payload: ReVerifyEmailDto) {
    const email = payload?.email?.trim().toLowerCase();

    if (!email) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'กรุณาระบุ Email!',
      });
    }

    const user = await this.verifyRepository.checkEmailVerify(email);

    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'ไม่พบผู้ใช้งานที่ใช้อีเมลนี้',
      });
    }

    if (user.emailVerify) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'อีเมลนี้ได้รับการยืนยันแล้ว',
      });
    }

    try {
      const { token } = await this.tokenService.setSecurityToken(
        user.userId,
        'EMAIL_VERIFICATION',
      );

      // await this.emailService.sendVerificationEmail(email, token);
      console.log(token);
      return {
        success: true,
        message: 'ส่งลิงก์ยืนยันอีเมลใหม่แล้ว',
      };
    } catch (error: unknown) {
      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: 'ส่งลิงก์ยืนยันอีเมลไม่สำเร็จ กรุณาลองใหม่ภายหลัง',
      });
    }
  }
}
