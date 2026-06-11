import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { UsersModule } from '../users/users.module';
import { AuthController } from './infra/http/controllers/AuthController';
import { RegisterUseCase } from './useCases/register/RegisterUseCase';
import { LoginUseCase } from './useCases/login/LoginUseCase';
import { JwtStrategy } from './infra/strategies/JwtStrategy';
import { JwtAuthGuard } from './infra/guards/JwtAuthGuard';

@Module({
  imports: [
    UsersModule, // fornece CreateUserUseCase e IUsersRepository
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '7d') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    JwtStrategy,
    // Guard global: protege TODAS as rotas, exceto as marcadas com @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
