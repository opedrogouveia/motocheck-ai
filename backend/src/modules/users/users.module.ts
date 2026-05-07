import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infra/prisma/PrismaService';
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
    PrismaService,
    { provide: IUsersRepository, useClass: PrismaUsersRepository },
    ListUsersUseCase,
    FindUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UsersModule {}
