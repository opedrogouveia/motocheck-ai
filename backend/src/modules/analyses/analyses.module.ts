import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infra/prisma/PrismaService';
import { IAnalysesRepository } from './domain/repositories/IAnalysesRepository';
import { PrismaAnalysesRepository } from './infra/prisma/repositories/PrismaAnalysesRepository';
import { AnalysesController } from './infra/http/controllers/AnalysesController';
import { CreateAnalysisUseCase } from './useCases/createAnalysis/CreateAnalysisUseCase';
import { UpdateAnalysisUseCase } from './useCases/updateAnalysis/UpdateAnalysisUseCase';
import { ListAnalysesUseCase } from './useCases/listAnalyses/ListAnalysesUseCase';
import { FindAnalysisByIdUseCase } from './useCases/findAnalysisById/FindAnalysisByIdUseCase';
import { DeleteAnalysisUseCase } from './useCases/deleteAnalysis/DeleteAnalysisUseCase';

@Module({
  controllers: [AnalysesController],
  providers: [
    PrismaService,
    { provide: IAnalysesRepository, useClass: PrismaAnalysesRepository },
    CreateAnalysisUseCase,
    UpdateAnalysisUseCase,
    ListAnalysesUseCase,
    FindAnalysisByIdUseCase,
    DeleteAnalysisUseCase,
  ],
})
export class AnalysesModule {}
