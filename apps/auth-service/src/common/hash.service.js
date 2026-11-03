var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'node:crypto';
let HashService = class HashService {
  options = {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  };
  async hashPassword(password) {
    return argon2.hash(password, this.options);
  }
  async verifyPassword(password, passwordHash) {
    return argon2.verify(passwordHash, password);
  }
  generateRefreshToken() {
    return randomBytes(32).toString('base64url');
  }
  hashRefreshToken(token) {
    return createHash('sha256').update(token).digest('hex');
  }
};
HashService = __decorate([Injectable()], HashService);
export { HashService };
//# sourceMappingURL=hash.service.js.map
