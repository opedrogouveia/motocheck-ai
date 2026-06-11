import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IConversationsRepository } from '../domain/IConversationsRepository';

/**
 * Registra a resposta que o vendedor deu a uma pergunta sugerida,
 * ou marca a pergunta como "não sei" (skip). Vira memória do agente.
 */
@Injectable()
export class AnswerQuestionUseCase {
  constructor(
    @Inject(IConversationsRepository)
    private conversations: IConversationsRepository,
  ) {}

  async execute(
    conversationId: string,
    userId: string,
    questionId: string,
    data: { answer?: string; skip?: boolean },
  ) {
    const owns = await this.conversations.belongsToUser(conversationId, userId);
    if (!owns) throw new NotFoundException('Conversa não encontrada.');

    if (data.skip) {
      return this.conversations.respondQuestion(conversationId, questionId, null, 'SKIPPED');
    }

    if (!data.answer || !data.answer.trim()) {
      throw new BadRequestException('Informe a resposta ou marque como "não sei".');
    }

    return this.conversations.respondQuestion(
      conversationId,
      questionId,
      data.answer.trim(),
      'ANSWERED',
    );
  }
}
