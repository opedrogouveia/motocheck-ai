# 🧠 Agente MotoCheck AI — design e "treinamento"

Este módulo concentra TODO o comportamento do agente. **Não há fine-tuning** (treino de modelo). O agente é especializado por três fontes, todas editáveis e versionadas no Git:

| Fonte | O que controla | Onde editar |
|------|----------------|-------------|
| **Persona** | Quem o agente é, escopo, tom | [`prompts/persona.ts`](prompts/persona.ts) |
| **Regras de saída** | Formato/JSON que ele devolve | [`prompts/outputRules.ts`](prompts/outputRules.ts) |
| **Exemplos (few-shot)** | Padrões a imitar (opcional) | [`prompts/examples.ts`](prompts/examples.ts) |
| **Conhecimento (RAG)** | Problemas conhecidos por modelo | catálogo no banco (`MotorcycleModel`/`KnownIssue`) + [`prisma/seed.ts`](../../../prisma/seed.ts) |
| **Memória** | Última análise, respostas/recusas do vendedor | montado automaticamente em `prompts/systemPrompt.ts` |

O montador final é [`prompts/systemPrompt.ts`](prompts/systemPrompt.ts), que junta tudo num único *system prompt*.

## Como "treinar" (especializar) o agente

1. **Mudar personalidade/escopo/tom** → edite `persona.ts`.
2. **Mudar o que ele preenche** (campos, estilo das perguntas) → edite `outputRules.ts` (mantenha coerente com o schema em [`llm/agent.types.ts`](llm/agent.types.ts)).
3. **Ensinar pelo exemplo** → preencha `examples.ts` com 1–2 anúncios e a análise ideal.
4. **Ampliar o conhecimento (o mais importante)** → adicione modelos e problemas conhecidos:
   - em lote: edite `prisma/seed.ts` e rode `npm run db:seed`;
   - avulso: `POST /motorcycle-models` e `POST /motorcycle-models/:id/issues` (precisa de token).

   Quanto mais rico o catálogo, mais preciso o agente — **sem retreinar nada**.

## Como o RAG funciona (resumo)

A cada mensagem, o [`SendMessageUseCase`](../conversations/useCases/SendMessageUseCase.ts):
1. Lê a mensagem + dados já conhecidos da moto.
2. Procura no catálogo modelos cuja marca/nome aparecem no texto.
3. Injeta os `KnownIssue` desses modelos no prompt (a "base de conhecimento").
4. Adiciona a memória da conversa (última análise, respostas/recusas do vendedor).
5. Chama o LLM exigindo saída estruturada e persiste o resultado.

## Trocar o provedor de LLM

Defina `LLM_PROVIDER` no `.env`:
- `gemini` → grátis, para desenvolvimento ([`llm/GeminiProvider.ts`](llm/GeminiProvider.ts));
- `claude` → pago, mais preciso, para demo/entrega ([`llm/ClaudeProvider.ts`](llm/ClaudeProvider.ts)).

O modelo específico vem de `GEMINI_MODEL` / `ANTHROPIC_MODEL`.

## Comportamento atual

Especialista em motos usadas populares. Para cada anúncio: classifica risco (LOW/MEDIUM/HIGH), lista red flags e recomendações, sugere perguntas ao vendedor (baseadas no catálogo), extrai dados estruturados da moto e lembra do contexto entre mensagens. O usuário pode responder, pular ("não sei") ou ignorar as perguntas e seguir a análise.

## Ideia futura (opcional)

Uma tela de administração no frontend para gerenciar o catálogo pela interface (em vez do seed) — viraria, na prática, um "painel de treinamento". Os endpoints já existem; falta só a UI. Não é necessário para o TCC.
