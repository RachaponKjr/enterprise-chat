import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor() {
    this.logger.log('AuthController initialized');
  }
  @GrpcMethod('AuthService', 'Health')
  health() {
    this.logger.log('Health RPC called');
    return {
      status: 'SERVING',
      service: 'auth-service',
    };
  }

  @GrpcMethod('AuthService', 'Register')
  register() {
    throw new RpcException({
      code: status.UNIMPLEMENTED,
      message: 'Register is not implemented',
    });
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
