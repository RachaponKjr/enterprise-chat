import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'node:crypto';

@Injectable()
export class HashService {
  private readonly options = {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  } satisfies Parameters<typeof argon2.hash>[1];

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, this.options);
  }

  async verifyPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return argon2.verify(passwordHash, password);
  }

  generateRefreshToken(): string {
    return randomBytes(32).toString('base64url');
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
