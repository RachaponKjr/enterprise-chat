import type { Observable } from 'rxjs';
import { RegisterDto } from '../dto/register.dto.js';
import { ReVerifyEmailDto, VerifyEmailDto } from '../dto/verify.dto.js';

export interface HealthResponse {
  status: boolean;
  service: string;
}

export interface RegisterResponse {
  user_id: string;
  message: string;
  email_verification_required: boolean;
}

export interface LoginResponse {
  challenge_id: string;
  available_challenges:
    | 'CHALLENGE_UNSPECIFIED'
    | 'CHALLENGE_PIN'
    | 'CHALLENGE_TOTP'
    | 'CHALLENGE_PASSKEY';
  expires_in: number;
}

export interface VerifyRespones {
  success: boolean;
  message: string;
}

export interface ResendVerifyRespones {
  success: boolean;
  message: string;
}

export interface AuthGrpcService {
  health(data: Record<string, never>): Observable<HealthResponse>;
  register(data: RegisterDto): Observable<RegisterResponse>;
  verifyEmail(data: VerifyEmailDto): Observable<VerifyRespones>;
  resendEmailVerification(data: ReVerifyEmailDto): Observable<ResendVerifyRespones>;
}
