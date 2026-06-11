import { Injectable } from '@nestjs/common';
import { MessageRole, QuestionStatus, RiskLevel, Severity, SellerType } from '@prisma/client';
import { PrismaService } from '../../../../shared/infra/prisma/PrismaService';
import { IConversationsRepository } from '../../domain/IConversationsRepository';
import {
  AnalysisView,
  ConversationDetail,
  ConversationSummary,
  MessageView,
  MotorcycleView,
  QuestionView,
  SaveAgentTurnParams,
  SaveAgentTurnResult,
} from '../../domain/types';

@Injectable()
export class PrismaConversationsRepository implements IConversationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, title?: string): Promise<ConversationSummary> {
    const row = await this.prisma.client.conversation.create({
      data: { userId, ...(title ? { title } : {}) },
    });
    return toSummary(row);
  }

  async listByUser(userId: string): Promise<ConversationSummary[]> {
    const rows = await this.prisma.client.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(toSummary);
  }

  async findDetail(id: string, userId: string): Promise<ConversationDetail | null> {
    const row = await this.prisma.client.conversation.findFirst({
      where: { id, userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        motorcycle: true,
        suggestedQuestions: { orderBy: { createdAt: 'asc' } },
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { redFlags: true, recommendations: true },
        },
      },
    });
    if (!row) return null;

    return {
      ...toSummary(row),
      messages: row.messages.map(toMessageView),
      motorcycle: row.motorcycle ? toMotorcycleView(row.motorcycle) : null,
      suggestedQuestions: row.suggestedQuestions.map(toQuestionView),
      latestAnalysis: row.analyses[0] ? toAnalysisView(row.analyses[0]) : null,
    };
  }

  async updateTitle(id: string, userId: string, title: string): Promise<ConversationSummary> {
    await this.ensureOwnership(id, userId);
    const row = await this.prisma.client.conversation.update({ where: { id }, data: { title } });
    return toSummary(row);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.ensureOwnership(id, userId);
    await this.prisma.client.conversation.delete({ where: { id } });
  }

  async belongsToUser(id: string, userId: string): Promise<boolean> {
    const count = await this.prisma.client.conversation.count({ where: { id, userId } });
    return count > 0;
  }

  async addMessage(
    conversationId: string,
    role: 'USER' | 'ASSISTANT' | 'SYSTEM',
    content: string,
  ): Promise<MessageView> {
    const row = await this.prisma.client.message.create({
      data: { conversationId, role: role as MessageRole, content },
    });
    return toMessageView(row);
  }

  async getRecentMessages(
    conversationId: string,
    limit: number,
  ): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
    const rows = await this.prisma.client.message.findMany({
      where: { conversationId, role: { in: ['USER', 'ASSISTANT'] } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows
      .reverse()
      .map((m) => ({ role: m.role === 'ASSISTANT' ? 'assistant' : 'user', content: m.content }));
  }

  async saveAgentTurn(params: SaveAgentTurnParams): Promise<SaveAgentTurnResult> {
    return this.prisma.client.$transaction(async (tx) => {
      // 1) Mensagem do assistente
      const message = await tx.message.create({
        data: {
          conversationId: params.conversationId,
          role: 'ASSISTANT',
          content: params.reply,
          model: params.model,
          tokensInput: params.usage.input,
          tokensOutput: params.usage.output,
        },
      });

      // 2) Análise (opcional) + filhos
      let analysisView: AnalysisView | null = null;
      if (params.analysis) {
        const analysis = await tx.analysis.create({
          data: {
            conversationId: params.conversationId,
            riskLevel: params.analysis.riskLevel as RiskLevel,
            summary: params.analysis.summary,
            redFlags: {
              create: params.analysis.redFlags.map((f) => ({
                category: f.category,
                description: f.description,
                severity: f.severity as Severity,
              })),
            },
            recommendations: {
              create: params.analysis.recommendations.map((r) => ({
                text: r.text,
                type: r.type,
              })),
            },
          },
          include: { redFlags: true, recommendations: true },
        });

        // vincula a análise à mensagem que a gerou
        await tx.message.update({ where: { id: message.id }, data: { analysisId: analysis.id } });
        analysisView = toAnalysisView(analysis);
      }

      // 3) Novas perguntas sugeridas (já deduplicadas pelo use case)
      if (params.newQuestions.length) {
        await tx.suggestedQuestion.createMany({
          data: params.newQuestions.map((question) => ({
            conversationId: params.conversationId,
            analysisId: analysisView?.id ?? null,
            question,
          })),
        });
      }

      // 4) Dados da moto (upsert 1:1 com a conversa, só campos informados)
      let motorcycleView: MotorcycleView | null = null;
      if (params.motorcycle) {
        const m = params.motorcycle;
        const data: Record<string, unknown> = {};
        if (m.brand !== undefined) data.brand = m.brand;
        if (m.model !== undefined) data.model = m.model;
        if (m.year !== undefined) data.year = m.year;
        if (m.mileageKm !== undefined) data.mileageKm = m.mileageKm;
        if (m.priceBRL !== undefined) data.priceBRL = m.priceBRL;
        if (m.location !== undefined) data.location = m.location;
        if (m.sellerType !== undefined) data.sellerType = m.sellerType as SellerType;
        if (params.modelCatalogId) data.modelCatalogId = params.modelCatalogId;

        if (Object.keys(data).length) {
          const moto = await tx.motorcycle.upsert({
            where: { conversationId: params.conversationId },
            create: { conversationId: params.conversationId, ...data },
            update: data,
          });
          motorcycleView = toMotorcycleView(moto);
        }
      }

      // 5) Atualiza título (se descobrimos a moto) e/ou bumpa updatedAt
      await tx.conversation.update({
        where: { id: params.conversationId },
        data: params.newTitle ? { title: params.newTitle } : { updatedAt: new Date() },
      });

      // 6) Lista atualizada de perguntas
      const questions = await tx.suggestedQuestion.findMany({
        where: { conversationId: params.conversationId },
        orderBy: { createdAt: 'asc' },
      });

      return {
        assistantMessage: { ...toMessageView(message), analysisId: analysisView?.id ?? null },
        analysis: analysisView,
        motorcycle: motorcycleView,
        suggestedQuestions: questions.map(toQuestionView),
      };
    });
  }

  async respondQuestion(
    conversationId: string,
    questionId: string,
    answer: string | null,
    status: 'ANSWERED' | 'SKIPPED',
  ): Promise<QuestionView> {
    const row = await this.prisma.client.suggestedQuestion.update({
      where: { id: questionId },
      data: {
        answer,
        status: status as QuestionStatus,
        answeredAt: status === 'ANSWERED' ? new Date() : null,
      },
    });
    return toQuestionView(row);
  }

  private async ensureOwnership(id: string, userId: string): Promise<void> {
    const ok = await this.belongsToUser(id, userId);
    if (!ok) throw new Error('Conversa não encontrada para este usuário.');
  }
}

// ---------------------- Mappers ----------------------

function toSummary(row: {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}): ConversationSummary {
  return { id: row.id, title: row.title, createdAt: row.createdAt, updatedAt: row.updatedAt };
}

function toMessageView(row: {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  analysisId?: string | null;
}): MessageView {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.createdAt,
    analysisId: row.analysisId ?? null,
  };
}

function toAnalysisView(row: {
  id: string;
  riskLevel: RiskLevel;
  summary: string;
  createdAt: Date;
  redFlags: { id: string; category: string; description: string; severity: Severity }[];
  recommendations: { id: string; text: string; type: string | null }[];
}): AnalysisView {
  return {
    id: row.id,
    riskLevel: row.riskLevel,
    summary: row.summary,
    createdAt: row.createdAt,
    redFlags: row.redFlags.map((f) => ({
      id: f.id,
      category: f.category,
      description: f.description,
      severity: f.severity,
    })),
    recommendations: row.recommendations.map((r) => ({ id: r.id, text: r.text, type: r.type })),
  };
}

function toQuestionView(row: {
  id: string;
  question: string;
  answer: string | null;
  status: string;
  createdAt: Date;
}): QuestionView {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    status: row.status,
    createdAt: row.createdAt,
  };
}

function toMotorcycleView(row: {
  brand: string | null;
  model: string | null;
  year: number | null;
  mileageKm: number | null;
  priceBRL: unknown;
  location: string | null;
  sellerType: SellerType | null;
}): MotorcycleView {
  return {
    brand: row.brand,
    model: row.model,
    year: row.year,
    mileageKm: row.mileageKm,
    priceBRL: row.priceBRL != null ? Number(row.priceBRL) : null,
    location: row.location,
    sellerType: row.sellerType,
  };
}
