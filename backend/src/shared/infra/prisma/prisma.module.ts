import { Global, Module } from '@nestjs/common';
import { PrismaService } from './PrismaService';

/**
 * Módulo global: disponibiliza o PrismaService para toda a aplicação
 * sem precisar declará-lo nos providers de cada módulo.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
