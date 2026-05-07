import { Injectable } from '@nestjs/common';
import { IAnalysesRepository } from '../../domain/repositories/IAnalysesRepository';

@Injectable()
export class ListAnalysesUseCase {
  constructor(private analysesRepository: IAnalysesRepository) {}
  async execute() {
    return await this.analysesRepository.findAll();
  }
}
