import { Injectable } from '@nestjs/common';
import { Severity } from '@prisma/client';
import { PrismaService } from '../../../../shared/infra/prisma/PrismaService';
import {
  CatalogIssue,
  CatalogModel,
  CreateIssueData,
  CreateModelData,
  IMotorcycleModelsRepository,
} from '../../domain/IMotorcycleModelsRepository';

@Injectable()
export class PrismaMotorcycleModelsRepository implements IMotorcycleModelsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CatalogModel[]> {
    return this.prisma.client.motorcycleModel.findMany({
      include: { knownIssues: true },
      orderBy: [{ brand: 'asc' }, { name: 'asc' }],
    }).then((rows) => rows.map(toCatalogModel));
  }

  async findById(id: string): Promise<CatalogModel | null> {
    const row = await this.prisma.client.motorcycleModel.findUnique({
      where: { id },
      include: { knownIssues: true },
    });
    return row ? toCatalogModel(row) : null;
  }

  async create(data: CreateModelData): Promise<CatalogModel> {
    const row = await this.prisma.client.motorcycleModel.create({
      data: { brand: data.brand, name: data.name, category: data.category },
      include: { knownIssues: true },
    });
    return toCatalogModel(row);
  }

  async addIssue(modelId: string, data: CreateIssueData): Promise<CatalogIssue> {
    const issue = await this.prisma.client.knownIssue.create({
      data: {
        modelId,
        title: data.title,
        description: data.description,
        severity: (data.severity as Severity) ?? 'MEDIUM',
        symptom: data.symptom,
        inspectionTip: data.inspectionTip,
      },
    });
    return toCatalogIssue(issue);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.motorcycleModel.delete({ where: { id } });
  }

  async findRelevant(brand?: string | null, model?: string | null): Promise<CatalogModel[]> {
    const terms = [brand, model].filter((t): t is string => !!t && t.trim().length > 1);
    if (!terms.length) return [];

    const rows = await this.prisma.client.motorcycleModel.findMany({
      where: {
        OR: terms.flatMap((t) => [
          { brand: { contains: t, mode: 'insensitive' as const } },
          { name: { contains: t, mode: 'insensitive' as const } },
        ]),
      },
      include: { knownIssues: true },
      take: 5,
    });
    return rows.map(toCatalogModel);
  }
}

type IssueRow = {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  symptom: string | null;
  inspectionTip: string | null;
};

function toCatalogIssue(i: IssueRow): CatalogIssue {
  return {
    id: i.id,
    title: i.title,
    description: i.description,
    severity: i.severity,
    symptom: i.symptom,
    inspectionTip: i.inspectionTip,
  };
}

function toCatalogModel(row: {
  id: string;
  brand: string;
  name: string;
  category: string | null;
  knownIssues: IssueRow[];
}): CatalogModel {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    category: row.category,
    issues: row.knownIssues.map(toCatalogIssue),
  };
}
