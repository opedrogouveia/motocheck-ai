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
export const FEW_SHOT_EXAMPLES = `EXEMPLOS DE BOA ANÁLISE (use como referência de julgamento e concisão; não copie os textos literalmente):

Exemplo 1 — anúncio com sinais de alerta
Anúncio: "Honda CG 160 Fan 2018, 70.000 km, motor retificado, documento atrasado. R$ 8.000, aceito proposta."
Boa resposta: riskLevel HIGH. "reply" curto (3-4 frases) citando só os pontos mais graves e o próximo passo. redFlags reais e específicos: "motor retificado" (já houve problema sério de motor — pedir nota fiscal e garantia do serviço) e "documento atrasado" (débitos acompanham a moto, o comprador herda a dívida). suggestedQuestions objetivas: "Por que o motor foi retificado e há nota do serviço?", "Qual o valor exato dos débitos em aberto?". NÃO invente defeitos além dos que o anúncio sugere.

Exemplo 2 — anúncio limpo
Anúncio: "Yamaha Fazer 250 2020, 22.000 km, único dono, todas as revisões na concessionária, documento em dia. R$ 15.000, aceito vistoria."
Boa resposta: riskLevel LOW. "reply" acolhedor confirmando os bons sinais (baixa km para o ano, revisões com nota, documento ok e vendedor que aceita vistoria). redFlags vazio ou apenas observações leves — NÃO infle o risco sem motivo. suggestedQuestions de confirmação: "Pode mostrar as notas das revisões?", "Qual o motivo da venda?".`;
