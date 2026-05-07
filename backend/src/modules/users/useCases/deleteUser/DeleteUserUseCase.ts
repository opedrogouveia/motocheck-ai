import { Injectable, NotFoundException } from '@nestjs/common';
import { IUsersRepository } from '../../domain/repositories/IUsersRepository';

@Injectable()
export class DeleteUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(id: string): Promise<void> {
    const userExists = await this.usersRepository.findById(id);

    if (!userExists) throw new NotFoundException('Usuário não encontrado');

    await this.usersRepository.delete(id);
  }
}
