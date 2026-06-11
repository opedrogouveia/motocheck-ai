/**
 * REGRAS DE SAÍDA — o formato estruturado que o agente deve devolver.
 *
 * 👉 Mexa aqui se quiser mudar O QUE o agente preenche (campos, estilo das
 * perguntas, quando preencher análise/moto). O schema técnico fica em
 * ../llm/agent.types.ts — mantenha os dois coerentes.
 */
export const OUTPUT_RULES = `REGRAS DE SAÍDA (obrigatórias):
- Devolva SEMPRE um objeto com os campos: "reply", "analysis", "motorcycle".
- "reply": sua mensagem conversacional para o usuário (string em português). É o que ele lê no chat.
- "analysis": preencha quando houver dados suficientes para avaliar a moto; caso contrário, use null. Contém riskLevel, summary, redFlags[], recommendations[] e suggestedQuestions[].
- "motorcycle": SEMPRE que a mensagem contiver marca, modelo, ano, quilometragem, preço ou localização, PREENCHA este objeto com os dados identificados (ex.: {"brand":"Honda","model":"CG 160 Fan","year":2019,"mileageKm":45000,"priceBRL":9500,"location":"São Paulo"}). Só omita se realmente nenhum dado novo da moto apareceu. Não invente valores.
- Não repita perguntas que já foram respondidas (veja a memória abaixo). Incorpore as respostas do vendedor na sua análise.
- suggestedQuestions devem ser curtas e práticas (ex.: "É de único dono?", "Tem todas as revisões na concessionária?").`;
