/**
 * Contrato da saída ESTRUTURADA do agente.
 *
 * Independente do provedor (Gemini ou Claude), o agente sempre devolve
 * este formato. `reply` é o texto conversacional; os demais campos são
 * os dados que persistimos (análise, moto, perguntas).
 */

export type RiskLevelValue = 'LOW' | 'MEDIUM' | 'HIGH';
export type SeverityValue = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SellerTypeValue = 'DEALER' | 'PRIVATE';

export interface AgentRedFlag {
  category: string;
  description: string;
  severity: SeverityValue;
}

export interface AgentRecommendation {
  text: string;
  type?: string;
}

export interface AgentAnalysis {
  riskLevel: RiskLevelValue;
  summary: string;
  redFlags: AgentRedFlag[];
  recommendations: AgentRecommendation[];
  suggestedQuestions: string[];
}

export interface AgentMotorcycle {
  brand?: string;
  model?: string;
  year?: number;
  mileageKm?: number;
  priceBRL?: number;
  location?: string;
  sellerType?: SellerTypeValue;
}

export interface AgentResponse {
  /** Resposta conversacional exibida ao usuário no chat. */
  reply: string;
  /** Análise estruturada (presente quando há anúncio/dados suficientes). */
  analysis: AgentAnalysis | null;
  /** Dados estruturados da moto identificados/atualizados nesta interação. */
  motorcycle: AgentMotorcycle | null;
}

/**
 * JSON Schema da resposta — usado pelo Claude (tool use) e como referência.
 */
export const AGENT_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    reply: {
      type: 'string',
      description: 'Resposta conversacional em português para o usuário.',
    },
    analysis: {
      type: 'object',
      description:
        'Análise estruturada da moto. OMITA este campo se ainda não houver informação suficiente.',
      properties: {
        riskLevel: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
        summary: { type: 'string' },
        redFlags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              description: { type: 'string' },
              severity: {
                type: 'string',
                enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
              },
            },
            required: ['category', 'description', 'severity'],
          },
        },
        recommendations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              type: { type: 'string' },
            },
            required: ['text'],
          },
        },
        suggestedQuestions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Perguntas objetivas para o usuário fazer ao vendedor.',
        },
      },
      required: ['riskLevel', 'summary', 'redFlags', 'recommendations', 'suggestedQuestions'],
    },
    motorcycle: {
      type: 'object',
      description: 'Dados estruturados da moto. OMITA se nada novo foi identificado.',
      properties: {
        brand: { type: 'string' },
        model: { type: 'string' },
        year: { type: 'number' },
        mileageKm: { type: 'number' },
        priceBRL: { type: 'number' },
        location: { type: 'string' },
        sellerType: { type: 'string', enum: ['DEALER', 'PRIVATE'] },
      },
    },
  },
  required: ['reply'],
} as const;

const RISK_VALUES: RiskLevelValue[] = ['LOW', 'MEDIUM', 'HIGH'];
const SEVERITY_VALUES: SeverityValue[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

function asNumber(v: unknown): number | undefined {
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
}

/**
 * Normaliza/saneia o objeto vindo do LLM em um AgentResponse seguro.
 * Garante que um JSON malformado nunca derrube a aplicação.
 */
export function normalizeAgentResponse(raw: unknown): AgentResponse {
  const obj = (raw ?? {}) as Record<string, any>;

  const reply = asString(obj.reply) ?? 'Desculpe, não consegui processar a resposta.';

  let analysis: AgentAnalysis | null = null;
  if (obj.analysis && typeof obj.analysis === 'object') {
    const a = obj.analysis as Record<string, any>;
    const riskLevel = RISK_VALUES.includes(a.riskLevel) ? a.riskLevel : 'MEDIUM';
    analysis = {
      riskLevel,
      summary: asString(a.summary) ?? '',
      redFlags: Array.isArray(a.redFlags)
        ? a.redFlags
            .map((f: any) => ({
              category: asString(f?.category) ?? 'Geral',
              description: asString(f?.description) ?? '',
              severity: SEVERITY_VALUES.includes(f?.severity) ? f.severity : 'MEDIUM',
            }))
            .filter((f) => f.description)
        : [],
      recommendations: Array.isArray(a.recommendations)
        ? a.recommendations
            .map((r: any) => ({ text: asString(r?.text) ?? '', type: asString(r?.type) }))
            .filter((r) => r.text)
        : [],
      suggestedQuestions: Array.isArray(a.suggestedQuestions)
        ? a.suggestedQuestions.map((q: any) => asString(q)).filter((q): q is string => !!q)
        : [],
    };
  }

  let motorcycle: AgentMotorcycle | null = null;
  if (obj.motorcycle && typeof obj.motorcycle === 'object') {
    const m = obj.motorcycle as Record<string, any>;
    const candidate: AgentMotorcycle = {
      brand: asString(m.brand),
      model: asString(m.model),
      year: asNumber(m.year),
      mileageKm: asNumber(m.mileageKm),
      priceBRL: asNumber(m.priceBRL),
      location: asString(m.location),
      sellerType: m.sellerType === 'DEALER' || m.sellerType === 'PRIVATE' ? m.sellerType : undefined,
    };
    // Só mantém se houver ao menos um dado útil.
    if (Object.values(candidate).some((v) => v !== undefined)) {
      motorcycle = candidate;
    }
  }

  return { reply, analysis, motorcycle };
}
