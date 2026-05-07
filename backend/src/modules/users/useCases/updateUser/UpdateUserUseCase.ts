import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUsersRepository } from '../../domain/repositories/IUsersRepository';
import { User } from '../../domain/entities/User';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private usersRepository: IUsersRepository,
  ) {}
  async execute(id: string, data: Partial<User>): Promise<User> {
    const userExists = await this.usersRepository.findById(id);

    if (!userExists) throw new NotFoundException('Usuário não encontrado');

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await this.usersRepository.update(id, data);
  }
}
