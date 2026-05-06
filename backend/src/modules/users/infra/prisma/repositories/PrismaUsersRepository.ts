import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../../domain/repositories/IUsersRepository';
import { User } from '../../../domain/entities/User';
import { PrismaService } from '../../../../../shared/infra/prisma/PrismaService';

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  // Corrigido para Promise<User>
  async create(user: User): Promise<User> {
    // Corrigido para usar this.prisma.client
    const createdUser = await this.prisma.client.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    return User.create(createdUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    // Corrigido para usar this.prisma.client
    const rawUser = await this.prisma.client.user.findUnique({
      where: { email },
    });

    if (!rawUser) return null;

    return User.create(rawUser);
  }
}
