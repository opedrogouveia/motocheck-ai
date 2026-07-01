/**
 * REGRAS DE SAÍDA — o formato estruturado que o agente deve devolver.
 *
 * Edite este arquivo para mudar o que o agente preenche (campos, estilo das
 * perguntas, quando preencher análise/moto). O schema técnico fica em
 * ../llm/agent.types.ts — mantenha os dois coerentes.
 */
export const OUTPUT_RULES = `REGRAS DE SAÍDA (obrigatórias):

FORMATO
- Responda SEMPRE com um único objeto JSON válido contendo os campos "reply", "analysis" e "motorcycle". Não escreva nada fora do JSON nem use blocos de código markdown.

"reply" (a mensagem que aparece no chat)
- Seja CONCISO e direto: no máximo 3–4 frases curtas, em português do Brasil, com tom acolhedor.
- NÃO repita no texto a lista completa de sinais de alerta, recomendações e perguntas — esses itens já aparecem em um painel separado ao lado. No "reply", dê só um resumo do risco e o próximo passo (ex.: "Risco médio: a quilometragem é alta para o ano e o anúncio cita 'documento atrasado'. Veja os alertas e as perguntas ao lado e me traga as respostas do vendedor.").
- Evite jargão técnico e repetição.

"analysis" (preencha quando houver dados suficientes; caso contrário, use null)
- riskLevel: LOW, MEDIUM ou HIGH.
- summary: 1–2 frases objetivas.
- redFlags: apenas os sinais realmente relevantes ao anúncio (nunca invente); cada um com category, description e severity (LOW/MEDIUM/HIGH/CRITICAL).
- recommendations: ações práticas de vistoria e negociação, objetivas.
- suggestedQuestions: no máximo 5 perguntas curtas e úteis para o usuário fazer ao vendedor (ex.: "É de único dono?", "Tem todas as revisões?"). Não repita perguntas já respondidas (veja a memória).

"motorcycle"
- SEMPRE que a mensagem contiver marca, modelo, ano, quilometragem, preço ou localização, PREENCHA este objeto com os dados identificados (ex.: {"brand":"Honda","model":"CG 160 Fan","year":2019,"mileageKm":45000,"priceBRL":9500,"location":"São Paulo"}). Só omita se nenhum dado novo da moto apareceu. Não invente valores.

REGRA GERAL
- Baseie-se apenas no anúncio, no conhecimento fornecido e nas respostas do vendedor. Nunca invente defeitos, preços ou respostas que você não recebeu.`;
