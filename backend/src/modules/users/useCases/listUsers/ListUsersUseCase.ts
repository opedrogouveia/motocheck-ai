import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../domain/repositories/IUsersRepository';
import { User } from '../../domain/entities/User';

@Injectable()
export class ListUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }
}
