import { Module } from '@nestjs/common';
import { IUsersRepository } from './domain/repositories/IUsersRepository';
import { PrismaUsersRepository } from './infra/prisma/repositories/PrismaUsersRepository';
import { UsersController } from './infra/http/controllers/UsersController';
import { ListUsersUseCase } from './useCases/listUsers/ListUsersUseCase';
import { FindUserByIdUseCase } from './useCases/findUserById/FindUserByIdUseCase';
import { CreateUserUseCase } from './useCases/createUser/CreateUserUseCase';
import { UpdateUserUseCase } from './useCases/updateUser/UpdateUserUseCase';
import { DeleteUserUseCase } from './useCases/deleteUser/DeleteUserUseCase';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: IUsersRepository, useClass: PrismaUsersRepository },
    ListUsersUseCase,
    FindUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [IUsersRepository, CreateUserUseCase],
})
export class UsersModule {}
