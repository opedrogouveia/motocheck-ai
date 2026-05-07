import { Injectable, NotFoundException } from '@nestjs/common';
import { IAnalysesRepository } from '../../domain/repositories/IAnalysesRepository';
import { Analysis } from '../../domain/entities/Analysis';
import { UpdateAnalysisDTO } from './UpdateAnalysisDTO';

@Injectable()
export class UpdateAnalysisUseCase {
  constructor(private analysesRepository: IAnalysesRepository) {}

  async execute(id: string, data: UpdateAnalysisDTO): Promise<Analysis> {
    const analysisExists = await this.analysesRepository.findById(id);

    if (!analysisExists) throw new NotFoundException('Análise não encontrada');

    return await this.analysesRepository.update(id, data);
  }
}
