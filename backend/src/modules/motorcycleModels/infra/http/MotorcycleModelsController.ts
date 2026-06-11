import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { IMotorcycleModelsRepository } from '../../domain/IMotorcycleModelsRepository';
import { CreateKnownIssueDTO, CreateMotorcycleModelDTO } from './dtos';
import { Public } from '../../../auth/decorators/Public';

/**
 * CRUD do catálogo de modelos e problemas conhecidos (base de conhecimento).
 * Leitura é pública (transparência no frontend); escrita exige autenticação.
 */
@Controller('motorcycle-models')
export class MotorcycleModelsController {
  constructor(
    @Inject(IMotorcycleModelsRepository)
    private repository: IMotorcycleModelsRepository,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.repository.findAll();
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    const model = await this.repository.findById(id);
    if (!model) throw new NotFoundException('Modelo não encontrado.');
    return model;
  }

  @Post()
  create(@Body() data: CreateMotorcycleModelDTO) {
    return this.repository.create(data);
  }

  @Post(':id/issues')
  async addIssue(@Param('id') id: string, @Body() data: CreateKnownIssueDTO) {
    const model = await this.repository.findById(id);
    if (!model) throw new NotFoundException('Modelo não encontrado.');
    return this.repository.addIssue(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repository.delete(id);
    return { message: 'Modelo removido.' };
  }
}
