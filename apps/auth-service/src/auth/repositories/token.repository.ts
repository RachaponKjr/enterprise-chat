import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'node:crypto';

import { SecurityTokenType } from '#prisma';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class TokenService {
  constructor(private readonly db: PrismaService) {}

  private generateToken(): string {
    return randomBytes(32).toString('base64url');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token, 'utf8').digest('hex');
  }

  async setSecurityToken(
    userId: string,
    type: SecurityTokenType,
  ): Promise<{
    token: string;
    expiresAt: Date;
  }> {
    const token = this.generateToken();
    const tokenHash = this.hashToken(token);

    const expiresInMinutes: Record<SecurityTokenType, number> = {
      EMAIL_VERIFICATION: 15,
      PASSWORD_RESET: 15,
      EMAIL_CHANGE: 15,
    };

    const expiresAt = new Date(Date.now() + expiresInMinutes[type] * 60 * 1000);

    await this.db.$transaction(async (tx) => {
      // ยกเลิก Token เดิมที่ยังไม่ได้ใช้
      await tx.securityToken.updateMany({
        where: {
          userId,
          type,
          consumedAt: null,
        },
        data: {
          consumedAt: new Date(),
        },
      });

      await tx.securityToken.create({
        data: {
          userId,
          type,
          tokenHash,
          expiresAt,
        },
      });
    });

    return {
      token,
      expiresAt,
    };
  }

  async consumeSecurityToken(tokenHash: string): Promise<void> {
    await this.db.securityToken.updateMany({
      where: {
        tokenHash,
        consumedAt: null,
      },
      data: {
        consumedAt: new Date(),
      },
    });
  }
}
