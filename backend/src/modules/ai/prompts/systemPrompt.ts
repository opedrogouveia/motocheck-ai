/**
 * MONTADOR do prompt de sistema do agente MotoCheck AI.
 *
 * Junta as 3 fontes de "treinamento" do agente:
 *   1. Persona  -> persona.ts        (quem ele é)
 *   2. Regras   -> outputRules.ts    (formato de saída)
 *   3. Exemplos -> examples.ts       (few-shot, opcional)
 * + Conhecimento (RAG do catálogo) e memória da conversa, montados aqui.
 *
 * NÃO é fine-tuning: especializar o agente = editar esses arquivos e
 * enriquecer o catálogo (MotorcycleModel / KnownIssue). Ver AGENT.md.
 */
import { BASE_PERSONA } from './persona';
import { OUTPUT_RULES } from './outputRules';
import { FEW_SHOT_EXAMPLES } from './examples';

export interface KnownIssueContext {
  title: string;
  description: string;
  severity: string;
  symptom?: string | null;
  inspectionTip?: string | null;
}

export interface ModelKnowledgeContext {
  brand: string;
  name: string;
  category?: string | null;
  issues: KnownIssueContext[];
}

export interface MemoryMotorcycle {
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  mileageKm?: number | null;
  priceBRL?: number | null;
  location?: string | null;
  sellerType?: string | null;
}

export interface MemoryAnalysis {
  riskLevel: string;
  summary: string;
  redFlags: { category: string; description: string }[];
}

export interface MemoryQuestion {
  question: string;
  answer?: string | null;
  status: string;
}

export interface AgentContext {
  knowledge: ModelKnowledgeContext[];
  motorcycle?: MemoryMotorcycle | null;
  lastAnalysis?: MemoryAnalysis | null;
  questions: MemoryQuestion[];
}

function formatKnowledge(knowledge: ModelKnowledgeContext[]): string {
  if (!knowledge.length) return '';
  const blocks = knowledge.map((model) => {
    const issues = model.issues
      .map(
        (i) =>
          `  - [${i.severity}] ${i.title}: ${i.description}` +
          (i.symptom ? ` (sintoma: ${i.symptom})` : '') +
          (i.inspectionTip ? ` (como verificar: ${i.inspectionTip})` : ''),
      )
      .join('\n');
    return `• ${model.brand} ${model.name}${model.category ? ` (${model.category})` : ''}:\n${issues}`;
  });
  return `\n\nBASE DE CONHECIMENTO — problemas conhecidos dos modelos relevantes (use para fundamentar a análise):\n${blocks.join('\n')}`;
}

function formatMemory(ctx: AgentContext): string {
  const parts: string[] = [];

  if (ctx.motorcycle) {
    const m = ctx.motorcycle;
    const fields = [
      m.brand && `marca: ${m.brand}`,
      m.model && `modelo: ${m.model}`,
      m.year && `ano: ${m.year}`,
      m.mileageKm != null && `km: ${m.mileageKm}`,
      m.priceBRL != null && `preço: R$ ${m.priceBRL}`,
      m.location && `local: ${m.location}`,
      m.sellerType && `vendedor: ${m.sellerType}`,
    ].filter(Boolean);
    if (fields.length) parts.push(`MOTO EM ANÁLISE: ${fields.join(', ')}.`);
  }

  if (ctx.lastAnalysis) {
    const a = ctx.lastAnalysis;
    const flags = a.redFlags.map((f) => `${f.category}: ${f.description}`).join('; ');
    parts.push(
      `ÚLTIMA ANÁLISE — risco ${a.riskLevel}. Resumo: ${a.summary}` +
        (flags ? ` Red flags: ${flags}.` : ''),
    );
  }

  const answered = ctx.questions.filter((q) => q.answer);
  if (answered.length) {
    parts.push(
      'RESPOSTAS DO VENDEDOR (memória — já obtidas, não pergunte de novo):\n' +
        answered.map((q) => `  - P: ${q.question}\n    R: ${q.answer}`).join('\n'),
    );
  }

  const pending = ctx.questions.filter((q) => q.status === 'PENDING');
  if (pending.length) {
    parts.push(
      'PERGUNTAS AINDA SEM RESPOSTA (o vendedor NÃO respondeu — trate como informação desconhecida, NÃO assuma nenhuma resposta para elas):\n' +
        pending.map((q) => `  - ${q.question}`).join('\n'),
    );
  }

  parts.push(
    'IMPORTANTE: o usuário pode continuar a análise mesmo sem todas as respostas. Trabalhe apenas com as informações efetivamente fornecidas, NUNCA invente ou presuma respostas das perguntas ainda sem resposta, e deixe claro o que permanece incerto.',
  );

  return parts.length ? `\n\nMEMÓRIA DA CONVERSA:\n${parts.join('\n\n')}` : '';
}

export function buildSystemPrompt(ctx: AgentContext): string {
  const examples = FEW_SHOT_EXAMPLES.trim() ? `\n\n${FEW_SHOT_EXAMPLES.trim()}` : '';
  return (
    BASE_PERSONA +
    '\n\n' +
    OUTPUT_RULES +
    examples +
    formatKnowledge(ctx.knowledge) +
    formatMemory(ctx)
  );
}
