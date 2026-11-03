import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'node:crypto';

@Injectable()
export class TokenService {
  generateOpaqueToken(): string {
    return randomBytes(32).toString('base64url');
  }

  hashToken(token: string): string {
    return createHash('sha256')
      .update(token, 'utf8')
      .digest('hex');
  }
}