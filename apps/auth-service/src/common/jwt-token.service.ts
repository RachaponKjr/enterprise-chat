import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(
    userId: string,
    sessionId: string,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
        sid: sessionId,
        jti: randomUUID(),
      },
      {
        expiresIn: '15m',
        issuer: 'enterprise-chat-auth',
        audience: 'enterprise-chat-api',
      },
    );
  }
}
