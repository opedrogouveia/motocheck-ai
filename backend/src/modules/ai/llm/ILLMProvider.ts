import { AgentResponse } from './agent.types';

export interface LLMMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LLMGenerateParams {
  /** Instruções de sistema (papel do agente + contexto/RAG). */
  system: string;
  /** Histórico da conversa. */
  messages: LLMMessage[];
}

export interface LLMResult {
  data: AgentResponse;
  model: string;
  usage: { input: number; output: number };
}

/**
 * Abstração do provedor de modelo de linguagem (LLM), isolando a
 * aplicação dos detalhes da API do Google Gemini.
 * Usada como token de injeção (classe abstrata) no NestJS.
 */
export abstract class ILLMProvider {
  abstract generate(params: LLMGenerateParams): Promise<LLMResult>;
}
