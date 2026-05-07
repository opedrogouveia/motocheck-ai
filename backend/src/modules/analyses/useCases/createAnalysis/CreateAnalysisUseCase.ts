import { Injectable } from '@nestjs/common';
import { IAnalysesRepository } from '../../domain/repositories/IAnalysesRepository';
import { Analysis } from '../../domain/entities/Analysis';

@Injectable()
export class CreateAnalysisUseCase {
  constructor(private analysesRepository: IAnalysesRepository) {}

  async execute(data: Analysis): Promise<Analysis> {
    return await this.analysesRepository.create(data);
  }
}
