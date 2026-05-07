import { Injectable, NotFoundException } from '@nestjs/common';
import { IUsersRepository } from '../../domain/repositories/IUsersRepository';
import { User } from '../../domain/entities/User';

@Injectable()
export class FindUserByIdUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }
}
