import { Injectable } from '@nestjs/common';
import { IAnalysesRepository } from '../../../domain/repositories/IAnalysesRepository';
import { Analysis } from '../../../domain/entities/Analysis';
import { PrismaService } from '../../../../../shared/infra/prisma/PrismaService';

@Injectable()
export class PrismaAnalysesRepository implements IAnalysesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Analysis[]> {
    const list = await this.prisma.client.analysis.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return list.map((item) => Analysis.create(item));
  }

  async findById(id: string): Promise<Analysis | null> {
    const item = await this.prisma.client.analysis.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return item ? Analysis.create(item) : null;
  }

  async create(data: Analysis): Promise<Analysis> {
    const analysis = await this.prisma.client.analysis.create({
      data: {
        adText: data.adText,
        riskLevel: data.riskLevel,
        suspiciousTerms: data.suspiciousTerms,
        questionsToAsk: data.questionsToAsk,
        userId: data.userId,
      },
    });

    return Analysis.create(analysis);
  }

  async update(id: string, data: Partial<Analysis>): Promise<Analysis> {
    const updated = await this.prisma.client.analysis.update({
      where: { id },
      data: {
        riskLevel: data.riskLevel,
        adText: data.adText,
      },
    });

    return Analysis.create(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.analysis.delete({ where: { id } });
  }
}
