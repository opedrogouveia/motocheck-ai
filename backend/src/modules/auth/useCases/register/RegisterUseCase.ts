import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { CreateUserDTO } from '../../../users/useCases/createUser/CreateUserDTO';

export interface AuthResult {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class RegisterUseCase {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private jwtService: JwtService,
  ) {}

  async execute(data: CreateUserDTO): Promise<AuthResult> {
    // Reaproveita a lógica de criação (hash de senha + e-mail único).
    const user = await this.createUserUseCase.execute(data);

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
