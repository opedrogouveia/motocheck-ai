import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { ILLMProvider, LLMGenerateParams, LLMResult } from './ILLMProvider';
import { AGENT_OUTPUT_SCHEMA, normalizeAgentResponse } from './agent.types';

/**
 * Provedor Claude (Anthropic) — opção paga, mais precisa, para demo/produção.
 * Usa "tool use" forçado para garantir saída estruturada e prompt caching
 * no system prompt (reduz custo nas mensagens seguintes da conversa).
 */
@Injectable()
export class ClaudeProvider extends ILLMProvider {
  private readonly logger = new Logger(ClaudeProvider.name);
  private readonly client: Anthropic;
  private readonly modelName: string;

  constructor(private config: ConfigService) {
    super();
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      this.logger.warn('ANTHROPIC_API_KEY não definida — chamadas ao Claude vão falhar.');
    }
    this.client = new Anthropic({ apiKey: apiKey ?? '' });
    this.modelName = this.config.get<string>('ANTHROPIC_MODEL') ?? 'claude-sonnet-4-6';
  }

  async generate(params: LLMGenerateParams): Promise<LLMResult> {
    const message = await this.client.messages.create({
      model: this.modelName,
      max_tokens: 2048,
      temperature: 0.4,
      // system como bloco com cache_control => prompt caching (mais barato).
      system: [
        {
          type: 'text',
          text: params.system,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
      tools: [
        {
          name: 'provide_response',
          description: 'Devolve a resposta do agente MotoCheck no formato estruturado exigido.',
          input_schema: AGENT_OUTPUT_SCHEMA as any,
        },
      ],
      tool_choice: { type: 'tool', name: 'provide_response' },
    });

    const toolUse = message.content.find((b) => b.type === 'tool_use');
    const input = toolUse && 'input' in toolUse ? toolUse.input : {};

    return {
      data: normalizeAgentResponse(input),
      model: this.modelName,
      usage: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
      },
    };
  }
}
