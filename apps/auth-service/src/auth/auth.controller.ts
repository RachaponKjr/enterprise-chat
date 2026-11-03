import { Controller, Logger, Req } from '@nestjs/common';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RegisterDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {
    this.logger.log('AuthController initialized');
  }
  @GrpcMethod('AuthService', 'Health')
  health() {
    this.logger.log('Health RPC called');
    return {
      status: true,
      service: 'auth-service',
    };
  }

  @GrpcMethod('AuthService', 'Register')
  async register(@Payload() payload: RegisterDto) {
    this.logger.log('Register RPC called');
    return this.authService.registerUser(payload);
  }

  @GrpcMethod('AuthService', 'Login')
  login() {
    throw new RpcException({
      code: status.UNIMPLEMENTED,
      message: 'Login is not implemented',
    });
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  refreshToken() {
    throw new RpcException({
      code: status.UNIMPLEMENTED,
      message: 'RefreshToken is not implemented',
    });
  }

  @GrpcMethod('AuthService', 'Logout')
  logout() {
    throw new RpcException({
      code: status.UNIMPLEMENTED,
      message: 'Logout is not implemented',
    });
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  validateToken() {
    throw new RpcException({
      code: status.UNIMPLEMENTED,
      message: 'ValidateToken is not implemented',
    });
  }

  @GrpcMethod('AuthService', 'CheckPermission')
  checkPermission() {
    throw new RpcException({
      code: status.UNIMPLEMENTED,
      message: 'CheckPermission is not implemented',
    });
  }
}
