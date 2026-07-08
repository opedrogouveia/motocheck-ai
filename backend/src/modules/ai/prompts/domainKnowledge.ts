/**
 * CONHECIMENTO GERAL de compra de moto usada — vale para QUALQUER moto,
 * mesmo as que não estão no catálogo. É a "expertise de base" do agente.
 *
 * Edite este arquivo para ampliar o conhecimento geral do agente
 * (o catálogo `MotorcycleModel`/`KnownIssue` cuida do conhecimento por modelo).
 */
export const GENERAL_KNOWLEDGE = `CONHECIMENTO GERAL DE ESPECIALISTA (aplique a QUALQUER moto, mesmo marcas/modelos que não estão no catálogo — isso é sua base de conhecimento universal sobre motocicletas):

## TERMOS DE ALERTA no texto do anúncio (levante suspeita e investigue)
- Motor: "motor retificado/aberto/recuperado", "motor batido", "para retirada de peças", "no estado", "motor fundido recuperado".
- Comercial: "repasse", "urgente", "só hoje", "primeiro que chegar", "aceito qualquer proposta", preço muito abaixo da média/FIPE.
- Documento: "doc atrasada/em atraso", "sem documento", "documento simples", "não transferida", "aguardando baixa de gravame", "nota fiscal perdida".
- Procedência: "leilão", "sinistro", "recuperada de roubo/furto/colisão", "remarcação de chassi/motor", "sucata aproveitável", "salvado".
- Recusa em permitir vistoria por mecânico de confiança ou test-ride é, por si só, um sinal de alerta forte.

## DOCUMENTAÇÃO NO BRASIL (verifique sempre, adapte a pergunta ao que faltar)
- CRLV (Certificado de Registro e Licenciamento de Veículo) em dia; ano corrente pago.
- IPVA e licenciamento sem débito (débitos acompanham o veículo, não a pessoa — o comprador herda a dívida).
- Multas pendentes: abatem do valor negociado; peça o extrato do Detran.
- Restrição financeira/gravame (alienação fiduciária): moto ainda financiada não pode ser transferida até a baixa; é o red flag documental mais crítico.
- ATPV-e (Autorização para Transferência de Veículo eletrônica) substituiu o antigo CRV/DUT em papel — confira se está corretamente preenchido e assinado digitalmente.
- Numeração de chassi e motor deve bater exatamente com o documento; caracteres borrados, resoldados ou risco de raspagem são sinal de adulteração.
- Prazo legal para o comprador transferir a propriedade é de 30 dias após a compra — atrasar gera multa.

## PROCEDÊNCIA E HISTÓRICO
- Motos de leilão (bancos, seguradoras, órgãos públicos) costumam ter desconto no preço porque carregam risco: podem ser sinistro de perda parcial ou total, recuperação de furto/roubo, ou simples inadimplência de financiamento.
- "Repasse" nem sempre é ruim — pode ser troca simples entre um cliente e a loja — mas combinado com preço abaixo da FIPE, sempre pergunte o motivo exato.
- Concessionárias/lojas que aceitam moto na troca por outro veículo é uma origem legítima e comum; different de retomada por inadimplência (mais arriscado, pode ter gravame ainda ativo).
- Único dono, com nota fiscal de revisões, é sempre o cenário de menor risco.

## VISTORIA POR SISTEMA (o que checar e por quê)

**Motor:**
- Partida a frio é o teste mais revelador: motor saudável liga rápido e estabiliza o ralenti em segundos.
- Fumaça branca/azulada persistente ao acelerar = queima de óleo (anéis de segmento ou retentores de válvula gastos) — reparo caro.
- Fumaça preta = mistura rica, pode ser só regulagem/injeção suja, mais barato de resolver.
- Ruído metálico ("tic-tic") no cabeçote = folga de válvulas por falta de regulagem periódica.
- Vazamento de óleo no cárter/embaixo do motor = retentores ressecados, comum em motos paradas por muito tempo ou muito antigas.

**Transmissão e embreagem** (varia pelo tipo de moto — veja seção de categorias abaixo):
- Corrente/relação (motos com corrente): corrente muito frouxa, enferrujada, ou dentes da coroa em formato de "anzol"/afiados indicam desgaste — kit de relação é caro de trocar (corrente + coroa + pinhão, sempre juntos).
- Embreagem manual: patinação (moto acelera mas não ganha velocidade proporcional) ou aperto muito dolorido na alavanca indica desgaste do disco/plato.
- Embreagem automática centrífuga (motos tipo Biz/Pop): "atraso" pra pegar tração em rampa é sinal de desgaste.
- CVT (scooters automáticas): correia e variador são itens de desgaste natural por volta de 20.000-25.000 km — pergunte se já foi trocado e se o óleo do CVT (separado do óleo do motor) é trocado periodicamente.

**Suspensão e freios:**
- Bengalas dianteiras: vazamento de óleo nas hastes cromadas é visível e indica retentor gasto.
- Amortecedor traseiro murcho ("moto balança demais" ou "afunda excessivo com peso") indica fim de vida útil.
- Discos de freio empenados (trepidação ao frear) ou muito finos, pastilhas rentes ao metal.
- Presença de ABS (motos mais recentes/valorizadas) — confira se a luz do painel apaga corretamente na partida.

**Elétrica:**
- Bateria: partida elétrica fraca ou que só funciona com pedal indica bateria no fim ou relé de partida com problema.
- "Gambiarras": fitas isolantes no chicote, alarmes/faróis de LED instalados por terceiros de forma amadora — indicam mau contato futuro e desvalorizam a moto.
- Painel/injeção eletrônica: luzes de advertência acesas (EFI, óleo, bateria) não devem ser ignoradas — pergunte o motivo.

**Chassi, pneus e alinhamento:**
- Sinais de solda, massa plástica ou tinta nova isolada numa parte do quadro sugerem batida/queda reparada.
- Desgaste irregular do pneu (mais de um lado) sugere problema de alinhamento, suspensão ou até quadro empenado.
- Código DOT no pneu informa a semana/ano de fabricação — borracha "ressecada" (rachaduras finas) mesmo com sulco aparente é insegura, independente da km rodada.

## COMBUSTÍVEL: FLEX x GASOLINA
- Motos flex (gasolina + etanol) que ficam muito tempo paradas com etanol no tanque podem sofrer corrosão no sistema de alimentação (etanol é higroscópico, absorve umidade) — pergunte se a moto rodou regularmente.
- Motos só a gasolina mais antigas com carburador: partida a frio mais sensível, exige afogador/estrangulador manual; normal, não é defeito por si só.

## MOTOS POR CATEGORIA (o que muda a atenção da vistoria)
- **Cub/econômicas (Biz, Pop e similares):** uso comum em trabalho/delivery — desconfie de km "baixa demais para o estado"; embreagem automática é o ponto de desgaste típico.
- **Street/naked de entrada (CG, Titan, Fan, Factor, Bros, Twister e similares):** a categoria mais popular no Brasil; corrente de transmissão e regulagem de válvulas são os itens de manutenção mais esquecidos.
- **Trail/adventure (Bros, XRE, Crosser, Lander e similares):** se usada fora de estrada, desgaste de suspensão, corrente e carenagem/proteções é mais acentuado; carenagem/plástico quebrado ou remendado é sinal de queda.
- **Scooters automáticas (PCX, NMax, Burgman, ADV e similares):** o item de desgaste característico é o conjunto CVT (correia e variador); baixa manutenção no resto, mas confira se o óleo do CVT (diferente do óleo do motor) é trocado.
- **Esportivas/carenadas (Ninja, CB 300R/500, MT-03 e similares):** plástico de carenagem é caro — arranhões/rachaduras indicam queda; motor de giro mais alto pede troca de óleo mais frequente.
- **Custom/cruiser (Intruder, Iron 883, Meteor 350 e similares):** motores V-twin ou grandes monocilíndricos têm dinâmica própria de vibração (não é defeito); confira correia dentada (alguns modelos usam correia em vez de corrente — item caro se rachada).
- **Importadas/premium (Harley-Davidson, Royal Enfield, Triumph, BMW, Ducati e similares):** peças e mão de obra mais caras, rede de assistência mais restrita fora de capitais — histórico de revisão em concessionária autorizada é ainda mais determinante no valor e no risco.

## CONTEXTO DE VALOR
- Compare sempre com a Tabela FIPE — preço muito abaixo pode significar problema oculto, muito acima pode significar acessórios/estado excepcional (pergunte a diferença).
- Quilometragem média esperada é de ~10.000 km/ano; muito abaixo disso pode ser odômetro adulterado ou moto pouco usada (ambos merecem pergunta); muito acima merece atenção redobrada na vistoria mecânica.
- Uso profissional (motoboy, aplicativo de entrega, moto-táxi) acelera desgaste de forma desproporcional à km rodada — sempre pergunte o uso anterior.
- Prefira sempre: único dono, revisões com nota fiscal, documentação sem pendência, e a possibilidade de vistoria por mecânico de confiança antes de fechar negócio.`;
