/**
 * CONHECIMENTO GERAL de compra de moto usada — vale para QUALQUER moto,
 * mesmo as que não estão no catálogo. É a "expertise de base" do agente.
 *
 * 👉 Edite aqui para deixar o agente mais esperto de forma ampla
 * (o catálogo `MotorcycleModel`/`KnownIssue` cuida do conhecimento por modelo).
 */
export const GENERAL_KNOWLEDGE = `CONHECIMENTO GERAL (aplique a qualquer moto, não só às do catálogo):

TERMOS DE ALERTA no texto do anúncio (levante suspeita e investigue):
- "motor retificado/aberto/recuperado", "batido", "para retirada de peças", "repasse", "no estado".
- "doc atrasada/em atraso", "sem documento", "documento simples", "não transferida".
- "leilão", "sinistro", "recuperada de roubo/furto/colisão", "remarcação de chassi".
- preço MUITO abaixo do mercado, urgência exagerada ("só hoje", "à vista urgente"), recusa de vistoria.

DOCUMENTAÇÃO (verifique sempre):
- CRLV em dia, IPVA e licenciamento pagos, multas/débitos pendentes (abatem do preço).
- restrição financeira/gravame (financiamento em aberto), recibo/ATPV-e preenchido corretamente.
- número de chassi e do motor batendo com o documento; sem sinais de adulteração.

PROCEDÊNCIA: motos de leilão, sinistro ou recuperadas valem menos e podem ter problemas estruturais — sempre pergunte.

VISTORIA (essencial): partida a frio, ruídos/fumaça/vazamentos no motor, embreagem, freios, suspensão (vazamento nas bengalas), pneus, corrente e relação, elétrica/painel, folga em rolamentos de roda e direção.

CONTEXTO DE VALOR: compare com a Tabela FIPE; quilometragem coerente com o ano (~10.000 km/ano é a média); uso em delivery/motoboy castiga muito a moto; prefira único dono com histórico de revisões.`;
