import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IConversationsRepository } from '../domain/IConversationsRepository';
import { ILLMProvider } from '../../ai/llm/ILLMProvider';
import { ConversationDetail } from '../domain/types';

export type ComparisonRecommendation = 'RECOMMEND' | 'CONSIDER' | 'AVOID';

export interface ComparisonItem {
  conversationId: string;
  title: string;
  recommendation: ComparisonRecommendation;
  rank: number;
  reason: string;
}

export interface ComparisonResult {
  verdict: string;
  bestConversationId: string | null;
  items: ComparisonItem[];
}

const REC_VALUES: ComparisonRecommendation[] = ['RECOMMEND', 'CONSIDER', 'AVOID'];

/**
 * Compara as análises de 2 a 3 conversas (motos) do usuário e devolve um
 * veredito único: ranking, recomendação por moto e a melhor escolha.
 */
@Injectable()
export class CompareConversationsUseCase {
  private readonly logger = new Logger(CompareConversationsUseCase.name);

  constructor(
    @Inject(IConversationsRepository)
    private conversations: IConversationsRepository,
    @Inject(ILLMProvider)
    private llm: ILLMProvider,
  ) {}

  async execute(userId: string, conversationIds: string[]): Promise<ComparisonResult> {
    const ids = [...new Set(conversationIds)];

    // findDetail já filtra por userId (isolamento) — null se não for do usuário.
    const details = await Promise.all(ids.map((id) => this.conversations.findDetail(id, userId)));
    const found = details.filter((d): d is ConversationDetail => !!d);
    if (found.length !== ids.length) {
      throw new NotFoundException('Uma ou mais conversas não foram encontradas.');
    }
    if (found.length < 2) {
      throw new NotFoundException('Selecione ao menos duas conversas para comparar.');
    }

    let result;
    try {
      result = await this.llm.generateJSON({
        system: this.buildSystem(),
        prompt: this.buildPrompt(found),
      });
    } catch (err) {
      this.logger.error(`Falha no provedor de IA (comparação): ${(err as Error).message}`);
      throw new BadGatewayException('Não foi possível gerar a comparação agora. Tente novamente.');
    }

    return this.normalize(result.raw, found);
  }

  private buildSystem(): string {
    return `Você é o MotoCheck AI, especialista em compra de motocicletas usadas no Brasil. Vou te dar a análise de 2 a 3 motos que um comprador está considerando. Compare-as de forma imparcial e ajude-o a decidir qual vale mais a pena e qual deve ser evitada.

Responda SEMPRE com um único objeto JSON válido (sem markdown, sem texto fora do JSON), no formato:
{
  "verdict": "2 a 4 frases comparando as motos e indicando a melhor escolha e a que evitar, em português",
  "items": [
    { "index": <número da moto>, "recommendation": "RECOMMEND" | "CONSIDER" | "AVOID", "rank": <1 é a melhor>, "reason": "1 a 2 frases justificando" }
  ]
}

Regras: inclua um item para CADA moto; use os índices exatamente como fornecidos; ranks sem empate (1, 2, 3...); baseie-se apenas nos dados fornecidos, nunca invente; seja conciso e direto.`;
  }

  private buildPrompt(details: ConversationDetail[]): string {
    const blocks = details.map((d, i) => {
      const m = d.motorcycle;
      const moto = m
        ? [
            m.brand && `marca ${m.brand}`,
            m.model && `modelo ${m.model}`,
            m.year && `ano ${m.year}`,
            m.mileageKm != null && `${m.mileageKm} km`,
            m.priceBRL != null && `R$ ${m.priceBRL}`,
            m.location && `local ${m.location}`,
          ]
            .filter(Boolean)
            .join(', ')
        : 'dados da moto não identificados';
      const a = d.latestAnalysis;
      const analysis = a
        ? `risco ${a.riskLevel}. ${a.summary}` +
          (a.redFlags.length
            ? ` Alertas: ${a.redFlags.map((f) => f.category).join(', ')}.`
            : '')
        : 'ainda sem análise de risco.';
      return `Moto [${i + 1}] — "${d.title}"\n  Dados: ${moto}\n  Análise: ${analysis}`;
    });
    return `Motos para comparar:\n\n${blocks.join('\n\n')}`;
  }

  private normalize(raw: unknown, details: ConversationDetail[]): ComparisonResult {
    const obj = (raw ?? {}) as Record<string, any>;
    const verdict =
      typeof obj.verdict === 'string' && obj.verdict.trim()
        ? obj.verdict.trim()
        : 'Não foi possível gerar uma conclusão. Tente novamente.';

    const rawItems: any[] = Array.isArray(obj.items) ? obj.items : [];
    const items: ComparisonItem[] = details.map((d, i) => {
      const match = rawItems.find((it) => Number(it?.index) === i + 1);
      const recommendation: ComparisonRecommendation = REC_VALUES.includes(match?.recommendation)
        ? match.recommendation
        : 'CONSIDER';
      const rank = Number.isFinite(Number(match?.rank)) ? Number(match.rank) : i + 1;
      const reason = typeof match?.reason === 'string' ? match.reason.trim() : '';
      return { conversationId: d.id, title: d.title, recommendation, rank, reason };
    });
    items.sort((a, b) => a.rank - b.rank);

    const best = items.find((it) => it.recommendation === 'RECOMMEND') ?? items[0] ?? null;
    return { verdict, bestConversationId: best?.conversationId ?? null, items };
  }
}
