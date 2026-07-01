import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Validação global de todos os DTOs de entrada.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não declarados no DTO
      forbidNonWhitelisted: true, // rejeita requisições com campos extras
      transform: true, // converte tipos (ex.: string -> number) automaticamente
    }),
  );

  // Libera o frontend (Next.js) a chamar a API.
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN')?.split(',') ?? '*',
    credentials: true,
  });

  const port = config.get<number>('PORT') ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`MotoCheck AI API rodando em http://localhost:${port}`);
}
void bootstrap();
