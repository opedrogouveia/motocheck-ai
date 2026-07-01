import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ILLMProvider, LLMGenerateParams, LLMJsonResult, LLMResult } from './ILLMProvider';
import { normalizeAgentResponse } from './agent.types';
import { parseJsonLoose } from './parseJson';

/**
 * Provedor de IA baseado no Google Gemini.
 * Usa responseMimeType JSON para forçar a saída estruturada do agente.
 */
@Injectable()
export class GeminiProvider extends ILLMProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private readonly client: GoogleGenerativeAI;
  private readonly modelName: string;

  constructor(private config: ConfigService) {
    super();
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY não definida — chamadas ao Gemini vão falhar.');
    }
    this.client = new GoogleGenerativeAI(apiKey ?? '');
    this.modelName = this.config.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash';
  }

  async generate(params: LLMGenerateParams): Promise<LLMResult> {
    const model = this.client.getGenerativeModel({
      model: this.modelName,
      systemInstruction: params.system,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
    });

    const contents = params.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Retry para erros transitórios (503 sobrecarga / UNAVAILABLE).
    const result = await this.withRetry(() => model.generateContent({ contents } as any));
    const text = result.response.text();
    const usage = result.response.usageMetadata;

    return {
      data: normalizeAgentResponse(parseJsonLoose(text)),
      model: this.modelName,
      usage: {
        input: usage?.promptTokenCount ?? 0,
        output: usage?.candidatesTokenCount ?? 0,
      },
    };
  }

  async generateJSON(params: { system: string; prompt: string }): Promise<LLMJsonResult> {
    const model = this.client.getGenerativeModel({
      model: this.modelName,
      systemInstruction: params.system,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
    });

    const result = await this.withRetry(() =>
      model.generateContent({
        contents: [{ role: 'user', parts: [{ text: params.prompt }] }],
      } as any),
    );
    const text = result.response.text();
    const usage = result.response.usageMetadata;

    return {
      raw: parseJsonLoose(text),
      model: this.modelName,
      usage: {
        input: usage?.promptTokenCount ?? 0,
        output: usage?.candidatesTokenCount ?? 0,
      },
    };
  }

  // Tenta novamente em erros transitórios (sobrecarga do Gemini), com backoff.
  private async withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
    let lastError: unknown;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        const msg = (err as Error)?.message ?? '';
        const transient = /\b(503|429|500|UNAVAILABLE|overloaded|high demand)\b/i.test(msg);
        if (!transient || i === attempts - 1) throw err;
        const delay = 800 * (i + 1);
        this.logger.warn(`Erro transitório do Gemini, tentando de novo em ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }
}
