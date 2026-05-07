import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  NotFoundException,
} from '@nestjs/common';

// DTOs
import { CreateUserDTO } from '../../../useCases/createUser/CreateUserDTO';
import { UpdateUserDTO } from 'src/modules/users/useCases/updateUser/UpdateUserDTO';

// UseCases
import { ListUsersUseCase } from 'src/modules/users/useCases/listUsers/ListUsersUseCase';
import { FindUserByIdUseCase } from 'src/modules/users/useCases/findUserById/FindUserByIdUseCase';
import { CreateUserUseCase } from '../../../useCases/createUser/CreateUserUseCase';
import { UpdateUserUseCase } from '../../../useCases/updateUser/UpdateUserUseCase';
import { DeleteUserUseCase } from 'src/modules/users/useCases/deleteUser/DeleteUserUseCase';

import { IUsersRepository } from '../../../domain/repositories/IUsersRepository';

@Controller('users')
export class UsersController {
  constructor(
    private listUsersUseCase: ListUsersUseCase,
    private findUserByIdUseCase: FindUserByIdUseCase,
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private usersRepository: IUsersRepository,
  ) {}

  @Get()
  async findAll() {
    const users = await this.listUsersUseCase.execute();

    return users.map(({ password, ...user }) => user);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.findUserByIdUseCase.execute(id);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const { password, ...userData } = user;
    return userData;
  }

  @Post()
  async create(@Body() data: CreateUserDTO) {
    const user = await this.createUserUseCase.execute(data);

    const { password, ...userData } = user;
    return userData;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    const user = await this.updateUserUseCase.execute(id, data);

    const { password, ...userData } = user;
    return userData;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute(id);

    return { message: 'Usuário deletado com sucesso.' };
  }
}
