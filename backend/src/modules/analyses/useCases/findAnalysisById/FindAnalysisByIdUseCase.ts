import { Injectable, NotFoundException } from '@nestjs/common';
import { IAnalysesRepository } from '../../domain/repositories/IAnalysesRepository';

@Injectable()
export class FindAnalysisByIdUseCase {
  constructor(private analysesRepository: IAnalysesRepository) {}
  async execute(id: string) {
    const analysis = await this.analysesRepository.findById(id);

    if (!analysis) throw new NotFoundException('Análise não encontrada');

    return analysis;
  }
}
