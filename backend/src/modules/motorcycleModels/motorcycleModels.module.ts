import { Module } from '@nestjs/common';
import { IMotorcycleModelsRepository } from './domain/IMotorcycleModelsRepository';
import { PrismaMotorcycleModelsRepository } from './infra/prisma/PrismaMotorcycleModelsRepository';
import { MotorcycleModelsController } from './infra/http/MotorcycleModelsController';

@Module({
  controllers: [MotorcycleModelsController],
  providers: [
    { provide: IMotorcycleModelsRepository, useClass: PrismaMotorcycleModelsRepository },
  ],
  exports: [IMotorcycleModelsRepository],
})
export class MotorcycleModelsModule {}
