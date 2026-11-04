import { createHash } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SecurityTokenType } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class VerifyEmailRepository {
  constructor(private readonly db: PrismaService) {}

  checkToken(token: string, type: SecurityTokenType) {
    const tokenHash = createHash('sha256').update(token, 'utf8').digest('hex');

    return this.db.securityToken.findFirst({
      where: { tokenHash, type },
    });
  }

  async checkEmailVerify(
    email: string,
  ): Promise<{ userId: string; emailVerify: boolean } | null> {
    const user = await this.db.user.findUnique({
      where: { email },
      select: { id: true, emailVerifiedAt: true },
    });

    if (!user) return null;

    return {
      userId: user.id,
      emailVerify: user.emailVerifiedAt !== null,
    };
  }

  async completeVerification(tokenId: string, userId: string): Promise<void> {
    await this.db.$transaction(async (tx) => {
      const now = new Date();

      // ใช้ Token แบบ Atomic เพื่อป้องกัน Race Condition
      const result = await tx.securityToken.updateMany({
        where: {
          id: tokenId,
          userId,
          type: SecurityTokenType.EMAIL_VERIFICATION,
          consumedAt: null,
          expiresAt: {
            gt: now,
          },
        },
        data: {
          consumedAt: now,
        },
      });

      if (result.count !== 1) {
        throw new RpcException({
          code: status.FAILED_PRECONDITION,
          message: 'Verification Token ไม่สามารถใช้งานได้',
        });
      }

      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          status: 'ACTIVE',
          emailVerifiedAt: new Date(),
        },
      });
    });
  }
}
