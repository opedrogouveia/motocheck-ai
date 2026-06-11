import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IConversationsRepository } from '../domain/IConversationsRepository';
import { IMotorcycleModelsRepository } from '../../motorcycleModels/domain/IMotorcycleModelsRepository';
import { ILLMProvider } from '../../ai/llm/ILLMProvider';
import { buildSystemPrompt, ModelKnowledgeContext } from '../../ai/prompts/systemPrompt';
import { MessageView } from '../domain/types';

const DEFAULT_TITLE = 'Nova conversa';
const HISTORY_LIMIT = 20;

function normalizeQuestion(q: string): string {
  return q
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?.!]/g, '')
    .trim();
}

@Injectable()
export class SendMessageUseCase {
  private readonly logger = new Logger(SendMessageUseCase.name);

  constructor(
    @Inject(IConversationsRepository)
    private conversations: IConversationsRepository,
    @Inject(IMotorcycleModelsRepository)
    private catalog: IMotorcycleModelsRepository,
    @Inject(ILLMProvider)
    private llm: ILLMProvider,
  ) {}

  async execute(conversationId: string, userId: string, content: string) {
    const owns = await this.conversations.belongsToUser(conversationId, userId);
    if (!owns) throw new NotFoundException('Conversa não encontrada.');

    // 1) Persiste a mensagem do usuário
    const userMessage = await this.conversations.addMessage(conversationId, 'USER', content);

    // 2) Carrega memória da conversa + histórico
    const detail = await this.conversations.findDetail(conversationId, userId);
    const history = await this.conversations.getRecentMessages(conversationId, HISTORY_LIMIT);

    // 3) RAG: encontra modelos relevantes no catálogo
    const allModels = await this.catalog.findAll();
    const haystack = [
      content,
      detail?.motorcycle?.brand,
      detail?.motorcycle?.model,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const relevantModels = allModels
      .filter(
        (m) =>
          haystack.includes(m.name.toLowerCase()) || haystack.includes(m.brand.toLowerCase()),
      )
      .slice(0, 5);

    const knowledge: ModelKnowledgeContext[] = relevantModels.map((m) => ({
      brand: m.brand,
      name: m.name,
      category: m.category,
      issues: m.issues,
    }));

    // 4) Monta o system prompt (persona + RAG + memória)
    const system = buildSystemPrompt({
      knowledge,
      motorcycle: detail?.motorcycle ?? null,
      lastAnalysis: detail?.latestAnalysis
        ? {
            riskLevel: detail.latestAnalysis.riskLevel,
            summary: detail.latestAnalysis.summary,
            redFlags: detail.latestAnalysis.redFlags.map((f) => ({
              category: f.category,
              description: f.description,
            })),
          }
        : null,
      questions: (detail?.suggestedQuestions ?? []).map((q) => ({
        question: q.question,
        answer: q.answer,
        status: q.status,
      })),
    });

    // 5) Chama o LLM
    let result;
    try {
      result = await this.llm.generate({ system, messages: history });
    } catch (err) {
      this.logger.error(`Falha no provedor de IA: ${(err as Error).message}`);
      throw new BadGatewayException(
        'Não foi possível consultar a IA agora. Verifique a API key e o provedor configurado.',
      );
    }

    const { data, model, usage } = result;

    // 6) Deduplica perguntas já existentes
    const existing = new Set((detail?.suggestedQuestions ?? []).map((q) => normalizeQuestion(q.question)));
    const newQuestions = (data.analysis?.suggestedQuestions ?? []).filter((q) => {
      const key = normalizeQuestion(q);
      if (!key || existing.has(key)) return false;
      existing.add(key);
      return true;
    });

    // 7) Resolve modelo do catálogo + novo título
    const moto = data.motorcycle;
    let modelCatalogId: string | null = null;
    if (moto?.brand || moto?.model) {
      const match = relevantModels.find(
        (m) =>
          (moto.model && m.name.toLowerCase().includes(moto.model.toLowerCase())) ||
          (moto.brand && m.brand.toLowerCase() === moto.brand.toLowerCase()),
      );
      modelCatalogId = match?.id ?? null;
    }

    let newTitle: string | null = null;
    const currentTitle = detail?.title ?? DEFAULT_TITLE;
    if (currentTitle === DEFAULT_TITLE && (moto?.brand || moto?.model)) {
      newTitle = [moto?.brand, moto?.model].filter(Boolean).join(' ').slice(0, 120);
    }

    // 8) Persiste o turno do agente
    const saved = await this.conversations.saveAgentTurn({
      conversationId,
      reply: data.reply,
      model,
      usage,
      analysis: data.analysis
        ? {
            riskLevel: data.analysis.riskLevel,
            summary: data.analysis.summary,
            redFlags: data.analysis.redFlags,
            recommendations: data.analysis.recommendations,
          }
        : null,
      newQuestions,
      motorcycle: data.motorcycle,
      modelCatalogId,
      newTitle,
    });

    return {
      userMessage: userMessage as MessageView,
      assistantMessage: saved.assistantMessage,
      analysis: saved.analysis,
      motorcycle: saved.motorcycle,
      suggestedQuestions: saved.suggestedQuestions,
      newTitle,
    };
  }
}
