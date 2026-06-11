import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { RegisterUseCase } from '../../../useCases/register/RegisterUseCase';
import { LoginUseCase } from '../../../useCases/login/LoginUseCase';
import { LoginDTO } from '../../../useCases/login/LoginDTO';
import { CreateUserDTO } from '../../../../users/useCases/createUser/CreateUserDTO';
import { Public } from '../../../decorators/Public';
import { CurrentUser } from '../../../decorators/CurrentUser';
import type { AuthUser } from '../../../decorators/CurrentUser';
import { IUsersRepository } from '../../../../users/domain/repositories/IUsersRepository';

@Controller('auth')
export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    @Inject(IUsersRepository)
    private usersRepository: IUsersRepository,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() data: CreateUserDTO) {
    return this.registerUseCase.execute(data);
  }

  @Public()
  @Post('login')
  async login(@Body() data: LoginDTO) {
    return this.loginUseCase.execute(data);
  }

  // Rota protegida: retorna o usuário autenticado.
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const found = await this.usersRepository.findById(user.userId);
    if (!found) throw new NotFoundException('Usuário não encontrado.');

    return {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role ?? 'USER',
    };
  }
}
