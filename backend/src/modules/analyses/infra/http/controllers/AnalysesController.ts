import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

// DTOs
import { CreateAnalysisDTO } from 'src/modules/analyses/useCases/createAnalysis/CreateAnalysisDTO';
import { UpdateAnalysisDTO } from 'src/modules/analyses/useCases/updateAnalysis/UpdateAnalysisDTO';

// UseCases
import { ListAnalysesUseCase } from 'src/modules/analyses/useCases/listAnalyses/ListAnalysesUseCase';
import { FindAnalysisByIdUseCase } from 'src/modules/analyses/useCases/findAnalysisById/FindAnalysisByIdUseCase';
import { CreateAnalysisUseCase } from '../../../useCases/createAnalysis/CreateAnalysisUseCase';
import { UpdateAnalysisUseCase } from 'src/modules/analyses/useCases/updateAnalysis/UpdateAnalysisUseCase';
import { DeleteAnalysisUseCase } from 'src/modules/analyses/useCases/deleteAnalysis/DeleteAnalysisUseCase';

import { IAnalysesRepository } from '../../../domain/repositories/IAnalysesRepository';

@Controller('analyses')
export class AnalysesController {
  constructor(
    private listAnalysesUseCase: ListAnalysesUseCase,
    private findAnalysisByIdUseCase: FindAnalysisByIdUseCase,
    private createAnalysisUseCase: CreateAnalysisUseCase,
    private updateAnalysisUseCase: UpdateAnalysisUseCase,
    private deleteAnalysisUseCase: DeleteAnalysisUseCase,
    private analysesRepository: IAnalysesRepository,
  ) {}

  @Get()
  async findAll() {
    return await this.listAnalysesUseCase.execute();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.findAnalysisByIdUseCase.execute(id);
  }

  @Post()
  async create(@Body() data: CreateAnalysisDTO) {
    return await this.createAnalysisUseCase.execute(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateAnalysisDTO) {
    return await this.updateAnalysisUseCase.execute(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteAnalysisUseCase.execute(id);

    return { message: 'Análise deletada' };
  }
}
