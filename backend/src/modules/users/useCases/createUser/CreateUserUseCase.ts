import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/User';
import { IUsersRepository } from '../../domain/repositories/IUsersRepository';
import { CreateUserDTO } from './CreateUserDTO';

export class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(data.email);

    if (userExists) {
      throw new Error('Usuário já cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const reg = await this.usersRepository.create(user);

    return reg;
  }
}
