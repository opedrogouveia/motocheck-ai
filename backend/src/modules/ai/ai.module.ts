import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILLMProvider } from './llm/ILLMProvider';
import { GeminiProvider } from './llm/GeminiProvider';
import { ClaudeProvider } from './llm/ClaudeProvider';

/**
 * Módulo de IA. Expõe ILLMProvider, resolvido em tempo de execução
 * conforme a env LLM_PROVIDER ("gemini" | "claude").
 * Trocar de provedor = trocar 1 variável de ambiente.
 */
@Module({
  providers: [
    GeminiProvider,
    ClaudeProvider,
    {
      provide: ILLMProvider,
      inject: [ConfigService, GeminiProvider, ClaudeProvider],
      useFactory: (
        config: ConfigService,
        gemini: GeminiProvider,
        claude: ClaudeProvider,
      ): ILLMProvider => {
        const provider = (config.get<string>('LLM_PROVIDER') ?? 'gemini').toLowerCase();
        const chosen = provider === 'claude' ? claude : gemini;
        new Logger('AiModule').log(`Provedor de IA ativo: ${provider}`);
        return chosen;
      },
    },
  ],
  exports: [ILLMProvider],
})
export class AiModule {}
