import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error.js';

type CreateUserInput = {
  email: string;
  displayName: string;
  passwordHash: string;
};

@Injectable()
export class UserRepository {
  constructor(private readonly db: PrismaService) {}

  findByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserInput) {
    try {
      return await this.db.user.create({
        data: {
          email: data.email,
          displayName: data.displayName,
          status: 'PENDING_VERIFICATION',
          credential: {
            create: {
              passwordHash: data.passwordHash,
              hashAlgorithm: 'argon2id',
            },
          },
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UserAlreadyExistsError();
      }

      throw error;
    }
  }
}
