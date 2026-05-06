import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserUseCase } from '../../../useCases/createUser/CreateUserUseCase';
import { CreateUserDTO } from '../../../useCases/createUser/CreateUserDTO';

@Controller('users')
export class UsersController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() data: CreateUserDTO) {
    const user = await this.createUserUseCase.execute(data);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
