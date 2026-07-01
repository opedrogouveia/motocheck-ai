import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IConversationsRepository } from '../../domain/IConversationsRepository';
import { SendMessageUseCase } from '../../useCases/SendMessageUseCase';
import { AnswerQuestionUseCase } from '../../useCases/AnswerQuestionUseCase';
import { CompareConversationsUseCase } from '../../useCases/CompareConversationsUseCase';
import {
  AnswerQuestionDTO,
  CompareConversationsDTO,
  CreateConversationDTO,
  RenameConversationDTO,
  SendMessageDTO,
} from '../../useCases/dtos';
import { CurrentUser } from '../../../auth/decorators/CurrentUser';
import type { AuthUser } from '../../../auth/decorators/CurrentUser';

@Controller('conversations')
export class ConversationsController {
  constructor(
    @Inject(IConversationsRepository)
    private conversations: IConversationsRepository,
    private sendMessageUseCase: SendMessageUseCase,
    private answerQuestionUseCase: AnswerQuestionUseCase,
    private compareUseCase: CompareConversationsUseCase,
  ) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateConversationDTO) {
    return this.conversations.create(user.userId, dto.title);
  }

  @Post('compare')
  compare(@CurrentUser() user: AuthUser, @Body() dto: CompareConversationsDTO) {
    return this.compareUseCase.execute(user.userId, dto.conversationIds);
  }

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.conversations.listByUser(user.userId);
  }

  @Get(':id')
  async detail(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const conversation = await this.conversations.findDetail(id, user.userId);
    if (!conversation) throw new NotFoundException('Conversa não encontrada.');
    return conversation;
  }

  @Patch(':id')
  async rename(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: RenameConversationDTO,
  ) {
    await this.ensureOwnership(id, user.userId);
    return this.conversations.updateTitle(id, user.userId, dto.title);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    await this.ensureOwnership(id, user.userId);
    await this.conversations.delete(id, user.userId);
    return { message: 'Conversa removida.' };
  }

  @Post(':id/messages')
  sendMessage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendMessageDTO,
  ) {
    return this.sendMessageUseCase.execute(id, user.userId, dto.content);
  }

  @Patch(':id/questions/:questionId')
  answer(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Param('questionId') questionId: string,
    @Body() dto: AnswerQuestionDTO,
  ) {
    return this.answerQuestionUseCase.execute(id, user.userId, questionId, dto);
  }

  private async ensureOwnership(id: string, userId: string) {
    const owns = await this.conversations.belongsToUser(id, userId);
    if (!owns) throw new NotFoundException('Conversa não encontrada.');
  }
}
