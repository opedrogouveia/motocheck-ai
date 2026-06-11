/**
 * EXEMPLOS (few-shot) — opcional.
 *
 * Uma forma poderosa de "treinar por prompt": mostrar 1-2 exemplos de
 * anúncio -> análise ideal. O agente tende a imitar o padrão.
 *
 * Deixe a string vazia ("") para não usar exemplos. Quando preenchida,
 * ela é anexada ao prompt do sistema numa seção "EXEMPLOS".
 *
 * Exemplo de como preencher (descomente e ajuste):
 *
 * export const FEW_SHOT_EXAMPLES = `EXEMPLOS DE BOA ANÁLISE:
 *
 * Anúncio: "CG 150 2012, 90.000 km, motor retificado recentemente, R$ 6.000".
 * Boa resposta: risco MEDIUM. Red flag: "motor retificado" indica que já houve
 * problema sério de motor — investigar a procedência do serviço. Perguntar nota
 * fiscal da retífica e garantia.`;
 */
export const FEW_SHOT_EXAMPLES = '';
