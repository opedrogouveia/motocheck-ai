import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../../domain/repositories/IUsersRepository';
import { User } from '../../../domain/entities/User';
import { PrismaService } from '../../../../../shared/infra/prisma/PrismaService';

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.client.user.findMany();

    return users.map((user) => User.create(user));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.client.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return User.create(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const rawUser = await this.prisma.client.user.findUnique({
      where: { email },
    });

    if (!rawUser) return null;

    return User.create(rawUser);
  }

  async create(user: User): Promise<User> {
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

  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await this.prisma.client.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return User.create(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.user.delete({
      where: { id },
    });
  }
}
