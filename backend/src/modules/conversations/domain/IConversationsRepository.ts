import {
  ConversationDetail,
  ConversationSummary,
  MessageView,
  QuestionView,
  SaveAgentTurnParams,
  SaveAgentTurnResult,
} from './types';

export abstract class IConversationsRepository {
  abstract create(userId: string, title?: string): Promise<ConversationSummary>;
  abstract listByUser(userId: string): Promise<ConversationSummary[]>;
  abstract findDetail(id: string, userId: string): Promise<ConversationDetail | null>;
  abstract updateTitle(id: string, userId: string, title: string): Promise<ConversationSummary>;
  abstract delete(id: string, userId: string): Promise<void>;

  /** Confere se a conversa pertence ao usuário (autorização). */
  abstract belongsToUser(id: string, userId: string): Promise<boolean>;

  /** Adiciona uma mensagem simples (ex.: a do usuário). */
  abstract addMessage(
    conversationId: string,
    role: 'USER' | 'ASSISTANT' | 'SYSTEM',
    content: string,
  ): Promise<MessageView>;

  /** Histórico recente para montar o contexto do LLM. */
  abstract getRecentMessages(
    conversationId: string,
    limit: number,
  ): Promise<{ role: 'user' | 'assistant'; content: string }[]>;

  /** Persiste o turno do agente (mensagem + análise + perguntas + moto) numa transação. */
  abstract saveAgentTurn(params: SaveAgentTurnParams): Promise<SaveAgentTurnResult>;

  /** Registra a resposta do vendedor (ANSWERED) ou marca como "não sei" (SKIPPED). */
  abstract respondQuestion(
    conversationId: string,
    questionId: string,
    answer: string | null,
    status: 'ANSWERED' | 'SKIPPED',
  ): Promise<QuestionView>;
}
