import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/User';
import { IUsersRepository } from '../../domain/repositories/IUsersRepository';
import { CreateUserDTO } from './CreateUserDTO';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private usersRepository: IUsersRepository,
  ) {}
  async execute(data: CreateUserDTO): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(data.email);

    if (userExists) throw new ConflictException('Email já cadastrado.');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return await this.usersRepository.create(user);
  }
}
