import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUsersRepository } from '../../../users/domain/repositories/IUsersRepository';
import { LoginDTO } from './LoginDTO';
import { AuthResult } from '../register/RegisterUseCase';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUsersRepository)
    private usersRepository: IUsersRepository,
    private jwtService: JwtService,
  ) {}

  async execute(data: LoginDTO): Promise<AuthResult> {
    const user = await this.usersRepository.findByEmail(data.email);

    // Mensagem genérica de propósito (não revela se o e-mail existe).
    if (!user) throw new UnauthorizedException('Credenciais inválidas.');

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Credenciais inválidas.');

    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      accessToken,
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role ?? 'USER',
      },
    };
  }
}
