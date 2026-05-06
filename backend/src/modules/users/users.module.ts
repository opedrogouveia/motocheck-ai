import { Module } from '@nestjs/common';
import { UsersController } from './infra/http/controllers/UsersController';
import { CreateUserUseCase } from './useCases/createUser/CreateUserUseCase';
import { PrismaUsersRepository } from './infra/prisma/repositories/PrismaUsersRepository';
import { IUsersRepository } from './domain/repositories/IUsersRepository';
import { PrismaService } from '../../shared/infra/prisma/PrismaService';

@Module({
  controllers: [UsersController],
  providers: [
    PrismaService,
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (usersRepo: IUsersRepository) => {
        return new CreateUserUseCase(usersRepo);
      },
      inject: [IUsersRepository],
    },
  ],
})
export class UsersModule {}
