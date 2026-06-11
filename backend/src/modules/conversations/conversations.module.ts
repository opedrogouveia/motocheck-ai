import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { MotorcycleModelsModule } from '../motorcycleModels/motorcycleModels.module';
import { IConversationsRepository } from './domain/IConversationsRepository';
import { PrismaConversationsRepository } from './infra/prisma/PrismaConversationsRepository';
import { ConversationsController } from './infra/http/ConversationsController';
import { SendMessageUseCase } from './useCases/SendMessageUseCase';
import { AnswerQuestionUseCase } from './useCases/AnswerQuestionUseCase';

@Module({
  imports: [AiModule, MotorcycleModelsModule],
  controllers: [ConversationsController],
  providers: [
    { provide: IConversationsRepository, useClass: PrismaConversationsRepository },
    SendMessageUseCase,
    AnswerQuestionUseCase,
  ],
})
export class ConversationsModule {}
