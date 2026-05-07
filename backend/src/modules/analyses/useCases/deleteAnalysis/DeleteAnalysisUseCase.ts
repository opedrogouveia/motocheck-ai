import { Injectable, NotFoundException } from '@nestjs/common';
import { IAnalysesRepository } from '../../domain/repositories/IAnalysesRepository';

@Injectable()
export class DeleteAnalysisUseCase {
  constructor(private analysesRepository: IAnalysesRepository) {}
  async execute(id: string) {
    const exists = await this.analysesRepository.findById(id);

    if (!exists) throw new NotFoundException('Análise não encontrada');

    await this.analysesRepository.delete(id);
  }
}
