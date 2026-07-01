import { Module } from '@nestjs/common';
import { ILLMProvider } from './llm/ILLMProvider';
import { GeminiProvider } from './llm/GeminiProvider';

/**
 * Módulo de IA. Expõe o acesso ao modelo de linguagem (Google Gemini)
 * por trás da interface ILLMProvider, isolando o restante da aplicação
 * dos detalhes do provedor.
 */
@Module({
  providers: [
    GeminiProvider,
    { provide: ILLMProvider, useExisting: GeminiProvider },
  ],
  exports: [ILLMProvider],
})
export class AiModule {}
