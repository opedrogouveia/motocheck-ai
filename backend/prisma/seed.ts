/**
 * Seed do catálogo de modelos e problemas conhecidos (base de conhecimento).
 *
 * Este é o "conhecimento de especialista" que o agente consulta (RAG).
 * Enriquecer esta lista ao longo do tempo = agente mais preciso, sem retreinar.
 *
 * Rodar: `npx prisma db seed` (ou `npm run db:seed`).
 */
import 'dotenv/config';
import { PrismaClient, Severity } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

type IssueSeed = {
  title: string;
  description: string;
  severity: Severity;
  symptom?: string;
  inspectionTip?: string;
};

type ModelSeed = {
  brand: string;
  name: string;
  category: string;
  issues: IssueSeed[];
};

const CATALOG: ModelSeed[] = [
  {
    brand: 'Honda',
    name: 'CG 160 Fan',
    category: 'Street',
    issues: [
      {
        title: 'Folga/ruído no comando de válvulas',
        description:
          'Motores com manutenção irregular podem apresentar ruído metálico no cabeçote por falta de regulagem de válvulas.',
        severity: 'MEDIUM',
        symptom: 'Tic-tic metálico no topo do motor, mais audível com o motor frio.',
        inspectionTip:
          'Ligar a moto fria e ouvir o cabeçote. Pedir nota fiscal da última regulagem de válvulas.',
      },
      {
        title: 'Corrente e relação desgastadas',
        description:
          'Kit de transmissão (corrente, coroa e pinhão) é item de desgaste; troca cara se negligenciada.',
        severity: 'LOW',
        symptom: 'Corrente folgada, dentes da coroa "afiados", trancos na arrancada.',
        inspectionTip: 'Verificar folga da corrente e o formato dos dentes da coroa.',
      },
      {
        title: 'Partida elétrica falhando',
        description:
          'Relé de partida e bateria fraca são comuns em unidades mais rodadas ou paradas por muito tempo.',
        severity: 'MEDIUM',
        symptom: 'Demora ou estala ao acionar a partida; precisa usar o pedal.',
        inspectionTip: 'Dar várias partidas a frio. Checar a data/saúde da bateria.',
      },
    ],
  },
  {
    brand: 'Yamaha',
    name: 'Factor 150',
    category: 'Street',
    issues: [
      {
        title: 'Consumo de óleo / fumaça',
        description:
          'Unidades muito rodadas ou com troca de óleo atrasada podem queimar óleo (anéis/retentores de válvula).',
        severity: 'HIGH',
        symptom: 'Fumaça azulada no escapamento, principalmente ao acelerar após o ralenti.',
        inspectionTip: 'Observar a saída do escapamento ao acelerar. Conferir nível e cor do óleo.',
      },
      {
        title: 'Injeção eletrônica / sensor',
        description:
          'Modelos injetados podem acusar falhas no sensor de O2 ou corpo de borboleta sujo.',
        severity: 'MEDIUM',
        symptom: 'Marcha lenta irregular, luz de injeção (EFI) acesa no painel.',
        inspectionTip: 'Ligar e observar se a luz de injeção apaga. Sentir a marcha lenta.',
      },
      {
        title: 'Rolamentos de roda',
        description: 'Rolamentos podem dar folga em motos rodadas ou que pegaram água/lama.',
        severity: 'MEDIUM',
        symptom: 'Ruído/zumbido aumentando com a velocidade; folga ao balançar a roda.',
        inspectionTip: 'Com a moto no descanso, balançar a roda lateralmente buscando folga.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'Biz 125',
    category: 'Cub',
    issues: [
      {
        title: 'Embreagem automática (centrífuga) gasta',
        description:
          'A Biz usa embreagem automática; o desgaste causa perda de força e patinação.',
        severity: 'MEDIUM',
        symptom: 'Moto "patina" em subidas, demora a engatar a tração.',
        inspectionTip: 'Testar arrancada em rampa. Sentir se a força chega à roda sem atraso.',
      },
      {
        title: 'Uso intenso como moto de trabalho',
        description:
          'Muitas unidades foram usadas em entrega (delivery), com alta quilometragem e desgaste acelerado.',
        severity: 'HIGH',
        symptom: 'Km alto para o ano, suspensão cansada, pintura/plásticos castigados.',
        inspectionTip: 'Desconfiar de km muito baixo "para o estado". Perguntar o uso anterior.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'CG 160 Titan',
    category: 'Street',
    issues: [
      {
        title: 'Vazamento no retentor do motor',
        description: 'Retentores ressecam e vazam óleo, comum em unidades mais antigas.',
        severity: 'MEDIUM',
        symptom: 'Manchas de óleo no bloco/embaixo do motor.',
        inspectionTip: 'Olhar embaixo do motor e a região do pinhão buscando vestígios de óleo.',
      },
      {
        title: 'Chicote/elétrica improvisada',
        description: 'Instalação de alarmes/faróis de LED por terceiros pode gerar mau contato.',
        severity: 'LOW',
        symptom: 'Luzes oscilando, fusível queimando, emendas com fita isolante.',
        inspectionTip: 'Inspecionar o chicote sob o tanque/farol procurando "gambiarras".',
      },
    ],
  },
  {
    brand: 'Yamaha',
    name: 'Fazer 250',
    category: 'Street',
    issues: [
      {
        title: 'Corrosão no tanque (modelos antigos)',
        description: 'Tanques de aço de unidades antigas podem ter ferrugem interna se ficaram parados.',
        severity: 'HIGH',
        symptom: 'Entupimento de bico/carburador, partida difícil, gosto de ferrugem no combustível.',
        inspectionTip: 'Abrir o tanque e inspecionar o interior com lanterna.',
      },
      {
        title: 'Refrigeração (modelos com radiador)',
        description: 'Versões refrigeradas a líquido exigem atenção ao nível/qualidade do fluido.',
        severity: 'MEDIUM',
        symptom: 'Superaquecimento, fluido sujo ou abaixo do nível.',
        inspectionTip: 'Conferir o reservatório de fluido e sinais de vazamento no radiador.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'CG 160 Start',
    category: 'Street',
    issues: [
      {
        title: 'Versão de entrada com itens simplificados',
        description: 'Trim mais básico da linha CG 160; instrumentação e acabamento mais simples, mas mesma base mecânica da Fan/Titan.',
        severity: 'LOW',
        symptom: 'Painel só analógico em versões mais antigas, sem partida elétrica em alguns anos.',
        inspectionTip: 'Confirmar o ano exato e os itens de série; comparar o preço com a ficha técnica real da versão.',
      },
      {
        title: 'Corrente e válvulas (mesma base do motor CG)',
        description: 'Compartilha o mesmo motor da Fan/Titan — os mesmos cuidados de corrente e regulagem de válvulas se aplicam.',
        severity: 'MEDIUM',
        symptom: 'Ruído de corrente frouxa, tic-tic no cabeçote.',
        inspectionTip: 'Mesma checagem da CG 160 Fan/Titan: corrente, coroa e regulagem de válvulas.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'Bros 160',
    category: 'Trail',
    issues: [
      {
        title: 'Sensor ESDD (Economizador/Flex) e partida a frio',
        description: 'Modelos flex podem apresentar dificuldade de partida a frio quando o sensor de etanol/gasolina ou a injeção estão desregulados.',
        severity: 'MEDIUM',
        symptom: 'Partida demorada em dias frios, marcha lenta instável logo após ligar.',
        inspectionTip: 'Testar a partida a frio (idealmente pela manhã) e observar quantos segundos leva pra estabilizar.',
      },
      {
        title: 'Desgaste acelerado por uso off-road',
        description: 'Trail usada em estrada de terra/trilha sofre desgaste maior de suspensão, corrente e proteções.',
        severity: 'MEDIUM',
        symptom: 'Suspensão dianteira com folga, carenagem/paralama com trincas ou remendos.',
        inspectionTip: 'Perguntar se o uso foi urbano ou rural/trilha; inspecionar plásticos e suspensão com atenção.',
      },
      {
        title: 'Uso profissional (entrega/moto-táxi)',
        description: 'Modelo muito usado como moto de trabalho em zona rural e entregas — quilometragem real pode ser maior que a informada.',
        severity: 'HIGH',
        symptom: 'Desgaste de banco, pedaleiras e manoplas incompatível com a km informada.',
        inspectionTip: 'Comparar o desgaste visual das partes de contato (banco, manoplas, pedaleiras) com a quilometragem alegada.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'Pop 110i',
    category: 'Cub',
    issues: [
      {
        title: 'Uso intenso como moto de entrada/trabalho',
        description: 'Moto muito popular como primeira moto e para pequenos trajetos urbanos/entregas leves.',
        severity: 'MEDIUM',
        symptom: 'Suspensão e embreagem automática desgastadas antes do esperado para a km informada.',
        inspectionTip: 'Testar arrancada e observar se a embreagem automática engata sem atraso.',
      },
      {
        title: 'Autonomia de tanque pequeno',
        description: 'Tanque reduzido não é defeito, mas o comprador iniciante pode confundir com falha de combustível.',
        severity: 'LOW',
        symptom: 'Necessidade de abastecer com mais frequência.',
        inspectionTip: 'Explicar ao usuário leigo que isso é característica de projeto, não avaria.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'CB Twister 250',
    category: 'Naked',
    issues: [
      {
        title: 'Corrente de comando (motor monocilíndrico 250cc)',
        description: 'Motor de maior cilindrada da linha de entrada; corrente de comando interna exige troca de óleo em dia.',
        severity: 'MEDIUM',
        symptom: 'Ruído metálico agudo vindo de dentro do motor, mais audível em marcha lenta.',
        inspectionTip: 'Perguntar a periodicidade de troca de óleo; ouvir o motor em marcha lenta com o painel lateral aberto se possível.',
      },
      {
        title: 'Freio a disco dianteiro',
        description: 'Pastilhas e disco de freio dianteiro têm desgaste natural mais rápido pelo maior peso/potência da moto.',
        severity: 'LOW',
        symptom: 'Ruído de metal-com-metal ao frear, disco riscado.',
        inspectionTip: 'Verificar a espessura das pastilhas e o estado da superfície do disco.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'XRE 190',
    category: 'Trail',
    issues: [
      {
        title: 'Desgaste por uso off-road real',
        description: 'Trail de entrada muito usada em estradas de terra; suspensão e corrente sofrem mais que o uso urbano.',
        severity: 'MEDIUM',
        symptom: 'Corrente ressecada/enferrujada, suspensão dianteira com vazamento.',
        inspectionTip: 'Perguntar o tipo de uso predominante (urbano x rural/trilha) e inspecionar a suspensão com atenção redobrada.',
      },
      {
        title: 'Embreagem exigida em trilha',
        description: 'Uso constante em subidas/terrenos irregulares desgasta a embreagem manual mais rápido.',
        severity: 'MEDIUM',
        symptom: 'Patinação da embreagem, alavanca com curso alterado.',
        inspectionTip: 'Testar arrancada em subida leve, se possível.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'XRE 300',
    category: 'Trail',
    issues: [
      {
        title: 'Motor de maior cilindrada, manutenção mais cara',
        description: 'Versão topo da linha XRE; peças e revisão custam mais que as trails de entrada.',
        severity: 'LOW',
        symptom: 'Custo de peças de reposição mais alto que a XRE 190.',
        inspectionTip: 'Pedir histórico de revisões em concessionária, dado o custo maior de manutenção.',
      },
      {
        title: 'Carenagem e proteções (sinal de queda)',
        description: 'Plásticos e protetor de motor quebrados ou remendados indicam queda ou uso off-road pesado.',
        severity: 'MEDIUM',
        symptom: 'Trincas, remendos com cola/fita, cores de plástico levemente diferentes (peça trocada).',
        inspectionTip: 'Inspecionar toda a carenagem e o protetor de motor buscando reparos.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'CB 300R',
    category: 'Naked',
    issues: [
      {
        title: 'Kit relação de alto desempenho',
        description: 'Corrente e coroa de motos mais potentes desgastam mais rápido que motos de entrada, especialmente com pilotagem esportiva.',
        severity: 'MEDIUM',
        symptom: 'Corrente ressecada ou com folga irregular, trancos na transmissão.',
        inspectionTip: 'Verificar lubrificação e tensão da corrente; perguntar sobre estilo de pilotagem do dono anterior.',
      },
      {
        title: 'Sensibilidade da injeção a combustível de má qualidade',
        description: 'Sistemas de injeção eletrônica mais sofisticados podem apresentar falhas com combustível adulterado.',
        severity: 'MEDIUM',
        symptom: 'Marcha lenta irregular, perda de potência, luz de injeção acesa.',
        inspectionTip: 'Observar o comportamento do motor em diferentes rotações durante o test-ride.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'PCX 150',
    category: 'Scooter',
    issues: [
      {
        title: 'Desgaste do conjunto CVT (correia e variador)',
        description: 'Scooters automáticas usam transmissão continuamente variável; a correia e o variador são itens de desgaste natural.',
        severity: 'MEDIUM',
        symptom: 'Ruído/vibração na aceleração, perda de resposta, "patinação" ao acelerar.',
        inspectionTip: 'Perguntar se já houve troca de correia/variador (comum por volta de 20.000-25.000 km) e testar a aceleração.',
      },
      {
        title: 'Óleo do CVT esquecido na revisão',
        description: 'O óleo da transmissão CVT é diferente do óleo do motor e muitas vezes é negligenciado em revisões não especializadas.',
        severity: 'LOW',
        symptom: 'Ruído seco na transmissão, aquecimento excessivo da caixa CVT.',
        inspectionTip: 'Perguntar especificamente sobre a troca do óleo da transmissão, não só do motor.',
      },
      {
        title: 'Bateria selada de reposição cara',
        description: 'Scooters dependem totalmente da partida elétrica (muitas não têm pedal); bateria fraca imobiliza a moto.',
        severity: 'MEDIUM',
        symptom: 'Partida fraca ou nula, painel piscando ao ligar.',
        inspectionTip: 'Dar partida a frio múltiplas vezes seguidas para testar a saúde da bateria.',
      },
    ],
  },
  {
    brand: 'Honda',
    name: 'ADV 160',
    category: 'Scooter',
    issues: [
      {
        title: 'Mesmos pontos de atenção do CVT (base PCX)',
        description: 'Compartilha a base mecânica da linha PCX; correia, variador e óleo da CVT exigem os mesmos cuidados.',
        severity: 'MEDIUM',
        symptom: 'Perda de resposta na aceleração, ruído na transmissão.',
        inspectionTip: 'Aplicar a mesma checagem de CVT da PCX 150.',
      },
      {
        title: 'Uso intenso em aplicativos de entrega',
        description: 'Modelo popular entre entregadores de aplicativo, o que significa alta quilometragem e uso contínuo.',
        severity: 'HIGH',
        symptom: 'Desgaste de banco e plásticos incompatível com a km informada.',
        inspectionTip: 'Perguntar diretamente se a moto foi usada para aplicativos de entrega.',
      },
    ],
  },
  {
    brand: 'Yamaha',
    name: 'YBR 125',
    category: 'Street',
    issues: [
      {
        title: 'Versões a carburador (modelos mais antigos)',
        description: 'Antes da injeção eletrônica se popularizar, a YBR usava carburador — exige afogador manual e é mais sensível a combustível parado.',
        severity: 'LOW',
        symptom: 'Partida a frio mais trabalhosa, necessidade de usar o afogador.',
        inspectionTip: 'Não confundir com defeito: perguntar o ano/versão exata (carburada ou injetada).',
      },
      {
        title: 'Corrosão por combustível parado',
        description: 'Unidades que ficaram muito tempo sem uso podem ter ferrugem no tanque ou entupimento no carburador.',
        severity: 'MEDIUM',
        symptom: 'Partida difícil, motor morre em marcha lenta, cheiro de ferrugem no combustível.',
        inspectionTip: 'Abrir o bocal do tanque e observar o interior com lanterna.',
      },
    ],
  },
  {
    brand: 'Yamaha',
    name: 'Crosser 150',
    category: 'Trail',
    issues: [
      {
        title: 'Desgaste em uso rural/trilha',
        description: 'Trail de entrada popular em áreas rurais; suspensão e corrente sofrem desgaste acelerado nesse uso.',
        severity: 'MEDIUM',
        symptom: 'Suspensão dianteira "dura" ou com vazamento, corrente seca/enferrujada.',
        inspectionTip: 'Perguntar sobre o tipo de terreno predominante e inspecionar a suspensão e a corrente.',
      },
      {
        title: 'Uso como moto de trabalho rural',
        description: 'Muito usada para deslocamento no campo, carregando peso extra (garupa, cargas), o que acelera o desgaste geral.',
        severity: 'MEDIUM',
        symptom: 'Amortecedor traseiro murcho, quadro com sinais de sobrecarga.',
        inspectionTip: 'Perguntar o uso predominante e testar o comportamento da suspensão com o piloto a bordo.',
      },
    ],
  },
  {
    brand: 'Yamaha',
    name: 'Lander 250',
    category: 'Trail',
    issues: [
      {
        title: 'Motor de maior cilindrada em uso off-road',
        description: 'Trail de maior porte; peças e revisão mais caras que as trails de entrada, especialmente após uso off-road intenso.',
        severity: 'MEDIUM',
        symptom: 'Corrente/coroa desgastadas de forma acentuada, custo de peça elevado na revisão.',
        inspectionTip: 'Pedir histórico de revisão em concessionária e inspecionar o kit de relação.',
      },
      {
        title: 'Sinais de queda (carenagem e protetor de motor)',
        description: 'Motos usadas em trilha estão mais sujeitas a quedas em baixa velocidade.',
        severity: 'LOW',
        symptom: 'Arranhões nas extremidades do guidão, protetor de motor riscado.',
        inspectionTip: 'Inspecionar as pontas do guidão, manoplas e protetor de motor.',
      },
    ],
  },
  {
    brand: 'Yamaha',
    name: 'Fazer FZ25',
    category: 'Naked',
    issues: [
      {
        title: 'Injeção eletrônica (diferente da Fazer 250 a carburador)',
        description: 'Geração mais nova, com injeção eletrônica; falhas de sensor são diferentes das versões carburadas antigas.',
        severity: 'MEDIUM',
        symptom: 'Luz de injeção acesa, marcha lenta instável.',
        inspectionTip: 'Confirmar se é a versão carburada (antiga) ou injetada (FZ25) antes de aplicar a checagem certa.',
      },
      {
        title: 'Corrente de relação em pilotagem esportiva',
        description: 'Pilotagem mais acelerada desgasta corrente e coroa mais rápido que o uso urbano tranquilo.',
        severity: 'LOW',
        symptom: 'Corrente com folga irregular ao longo do curso.',
        inspectionTip: 'Verificar a tensão da corrente em diferentes pontos da rotação da roda.',
      },
    ],
  },
  {
    brand: 'Yamaha',
    name: 'NMax 160',
    category: 'Scooter',
    issues: [
      {
        title: 'Desgaste do CVT (correia e variador)',
        description: 'Mesma lógica de qualquer scooter automática: correia e variador são itens de desgaste natural.',
        severity: 'MEDIUM',
        symptom: 'Perda de resposta na aceleração, ruído na transmissão.',
        inspectionTip: 'Perguntar sobre troca de correia/variador e testar a aceleração em diferentes velocidades.',
      },
      {
        title: 'Uso intenso em aplicativos de entrega',
        description: 'Modelo popular entre entregadores; alta quilometragem e uso contínuo em curtas distâncias.',
        severity: 'HIGH',
        symptom: 'Desgaste de banco e plásticos incompatível com a km informada.',
        inspectionTip: 'Perguntar diretamente sobre uso profissional/aplicativo de entrega.',
      },
    ],
  },
  {
    brand: 'Yamaha',
    name: 'MT-03',
    category: 'Naked',
    issues: [
      {
        title: 'Motor bicilíndrico, manutenção mais especializada',
        description: 'Categoria acima das motos de entrada; revisões exigem oficina especializada e peças mais caras.',
        severity: 'LOW',
        symptom: 'Custo de peça e mão de obra mais alto que motos populares.',
        inspectionTip: 'Priorizar histórico de revisão em concessionária/oficina especializada em importados.',
      },
      {
        title: 'Sinais de queda em baixa velocidade',
        description: 'Moto mais alta e pesada para iniciantes; comum ter pequenas quedas em manobras/estacionamento.',
        severity: 'MEDIUM',
        symptom: 'Arranhões nas extremidades do guidão, manete e pedaleiras.',
        inspectionTip: 'Inspecionar pontas do guidão, manetes e pedaleiras em busca de reparos ou substituições.',
      },
    ],
  },
  {
    brand: 'Yamaha',
    name: 'XTZ 250 Ténéré',
    category: 'Trail',
    issues: [
      {
        title: 'Uso off-road pesado',
        description: 'Trail com pretensão mais aventureira; motos usadas de fato fora de estrada sofrem desgaste estrutural maior.',
        severity: 'MEDIUM',
        symptom: 'Suspensão de curso longo com folga, quadro/carenagem com sinais de impacto.',
        inspectionTip: 'Perguntar sobre viagens/uso off-road e inspecionar suspensão e quadro com atenção.',
      },
      {
        title: 'Corrente e kit relação de longo curso',
        description: 'Suspensão de curso mais longo exige corrente com folga correta; regulagem incorreta acelera o desgaste.',
        severity: 'LOW',
        symptom: 'Corrente muito frouxa ou muito esticada.',
        inspectionTip: 'Verificar a folga da corrente com a moto no cavalete central, se houver.',
      },
    ],
  },
  {
    brand: 'Suzuki',
    name: 'Intruder 125',
    category: 'Custom',
    issues: [
      {
        title: 'Motor de baixa rotação, desgaste da embreagem',
        description: 'Estilo custom com pilotagem mais "relaxada"; embreagem pode sofrer com trocas de marcha mais bruscas.',
        severity: 'LOW',
        symptom: 'Patinação leve da embreagem em acelerações mais fortes.',
        inspectionTip: 'Testar arrancadas em diferentes intensidades de aceleração.',
      },
      {
        title: 'Cromados e acabamento (não mecânico, mas afeta valor)',
        description: 'Peças cromadas características do estilo custom enferrujam/oxidam se a moto ficar exposta ao tempo.',
        severity: 'LOW',
        symptom: 'Manchas de ferrugem em peças cromadas (escapamento, guidão).',
        inspectionTip: 'Inspecionar visualmente todas as peças cromadas.',
      },
    ],
  },
  {
    brand: 'Suzuki',
    name: 'Burgman 125',
    category: 'Scooter',
    issues: [
      {
        title: 'Desgaste do CVT (correia e variador)',
        description: 'Como toda scooter automática, o conjunto de transmissão continuamente variável desgasta com o uso.',
        severity: 'MEDIUM',
        symptom: 'Ruído ou vibração ao acelerar, perda de resposta.',
        inspectionTip: 'Perguntar sobre troca de correia/variador e testar a resposta de aceleração.',
      },
      {
        title: 'Bateria e partida elétrica',
        description: 'Scooters dependem fortemente da parte elétrica para dar partida.',
        severity: 'MEDIUM',
        symptom: 'Partida lenta ou fraca.',
        inspectionTip: 'Testar partida a frio múltiplas vezes.',
      },
    ],
  },
  {
    brand: 'Suzuki',
    name: 'GSR 150i',
    category: 'Naked',
    issues: [
      {
        title: 'Peças de reposição menos disponíveis',
        description: 'Marca com rede de assistência mais restrita no Brasil comparada a Honda/Yamaha; peças podem demorar mais para chegar.',
        severity: 'LOW',
        symptom: 'Dificuldade em achar peça original rapidamente.',
        inspectionTip: 'Perguntar onde o dono costuma fazer manutenção e se encontra peças com facilidade na região.',
      },
      {
        title: 'Corrente e regulagem de válvulas',
        description: 'Mesma lógica de qualquer naked de entrada: corrente e válvulas são os itens de manutenção mais esquecidos.',
        severity: 'MEDIUM',
        symptom: 'Ruído de corrente frouxa, tic-tic no motor.',
        inspectionTip: 'Checagem padrão de corrente e regulagem de válvulas.',
      },
    ],
  },
  {
    brand: 'Bajaj',
    name: 'Dominar 400',
    category: 'Naked',
    issues: [
      {
        title: 'Rede de assistência técnica mais restrita',
        description: 'Marca indiana com presença crescente no Brasil, mas rede de concessionárias menor que Honda/Yamaha.',
        severity: 'MEDIUM',
        symptom: 'Dificuldade de encontrar oficina autorizada fora de grandes centros.',
        inspectionTip: 'Perguntar onde as revisões foram feitas e se há concessionária próxima da região do comprador.',
      },
      {
        title: 'Motor de maior cilindrada, cuidados de refrigeração',
        description: 'Motor robusto e de alta cilindrada para a categoria; exige atenção ao líquido de arrefecimento.',
        severity: 'MEDIUM',
        symptom: 'Superaquecimento, nível do fluido de arrefecimento baixo.',
        inspectionTip: 'Verificar o reservatório de fluido de arrefecimento e sinais de vazamento no radiador.',
      },
    ],
  },
  {
    brand: 'Kawasaki',
    name: 'Ninja 300',
    category: 'Sport',
    issues: [
      {
        title: 'Carenagem cara de repor',
        description: 'Moto esportiva carenada; plásticos são caros e frequentemente danificados em quedas de baixa velocidade.',
        severity: 'MEDIUM',
        symptom: 'Arranhões, rachaduras ou parafusos faltando na carenagem, cores de plástico levemente diferentes.',
        inspectionTip: 'Inspecionar toda a carenagem procurando reparos com cola/fita ou peças de cor levemente diferente.',
      },
      {
        title: 'Motor de giro alto, troca de óleo mais frequente',
        description: 'Motor esportivo trabalha em rotações mais altas e exige troca de óleo mais frequente que motos de baixa cilindrada.',
        severity: 'LOW',
        symptom: 'Óleo escuro/vencido, ruído de motor "seco".',
        inspectionTip: 'Perguntar a periodicidade real das trocas de óleo (deve ser mais frequente que motos populares).',
      },
    ],
  },
  {
    brand: 'Kawasaki',
    name: 'Z400',
    category: 'Naked',
    issues: [
      {
        title: 'Mesmo motor da Ninja 300/400, cuidados equivalentes',
        description: 'Compartilha base mecânica com a linha esportiva da marca; mesma atenção a troca de óleo e revisões.',
        severity: 'LOW',
        symptom: 'Óleo vencido, revisões atrasadas.',
        inspectionTip: 'Pedir histórico de revisão em concessionária.',
      },
      {
        title: 'Peças e mão de obra especializada',
        description: 'Marca premium com rede de assistência mais restrita; manutenção fora de concessionária pode ser feita com peças não originais.',
        severity: 'MEDIUM',
        symptom: 'Peças visivelmente não originais (acabamento diferente).',
        inspectionTip: 'Perguntar se todas as peças trocadas são originais e pedir notas fiscais.',
      },
    ],
  },
  {
    brand: 'Royal Enfield',
    name: 'Meteor 350',
    category: 'Custom',
    issues: [
      {
        title: 'Motor monocilíndrico de vibração característica',
        description: 'Vibração mais perceptível que motos japonesas de mesma cilindrada é característica de projeto, não defeito.',
        severity: 'LOW',
        symptom: 'Vibração perceptível em rotações médias/altas — normal para o modelo.',
        inspectionTip: 'Explicar ao comprador leigo que isso é característica da marca, não avaria, mas ainda vale checar ruídos anormais além da vibração esperada.',
      },
      {
        title: 'Rede de assistência ainda em expansão no Brasil',
        description: 'Marca relativamente nova no mercado brasileiro; concessionárias concentradas em capitais.',
        severity: 'MEDIUM',
        symptom: 'Dificuldade de manutenção fora de grandes centros.',
        inspectionTip: 'Verificar proximidade de concessionária autorizada da região do comprador.',
      },
    ],
  },
  {
    brand: 'Harley-Davidson',
    name: 'Iron 883',
    category: 'Custom',
    issues: [
      {
        title: 'Custo elevado de peças e manutenção',
        description: 'Marca premium; peças originais e mão de obra especializada custam significativamente mais que motos nacionais populares.',
        severity: 'MEDIUM',
        symptom: 'Orçamentos de revisão bem acima da média de motos populares.',
        inspectionTip: 'Exigir histórico completo de revisões em concessionária autorizada, dado o custo de manutenção.',
      },
      {
        title: 'Correia de transmissão (não é corrente)',
        description: 'Muitos modelos usam correia dentada em vez de corrente; a correia é durável mas cara se precisar de troca.',
        severity: 'MEDIUM',
        symptom: 'Rachaduras ou desgaste visível nos dentes da correia.',
        inspectionTip: 'Inspecionar visualmente a correia de transmissão procurando rachaduras.',
      },
    ],
  },
  {
    brand: 'Haojue',
    name: 'DK 150',
    category: 'Trail',
    issues: [
      {
        title: 'Marca de entrada, disponibilidade de peças',
        description: 'Marca mais recente e de menor custo no mercado brasileiro; disponibilidade de peças originais pode ser mais restrita.',
        severity: 'MEDIUM',
        symptom: 'Demora para encontrar peça de reposição original.',
        inspectionTip: 'Perguntar sobre a facilidade de manutenção e disponibilidade de peças na região.',
      },
      {
        title: 'Desgaste padrão de trail de entrada',
        description: 'Mesma lógica de qualquer trail popular: corrente, suspensão e carenagem sofrem mais com uso off-road.',
        severity: 'LOW',
        symptom: 'Corrente seca, plásticos com trincas.',
        inspectionTip: 'Checagem padrão de trail: corrente, suspensão e carenagem.',
      },
    ],
  },
  {
    brand: 'Shineray',
    name: 'Worker 125',
    category: 'Cub',
    issues: [
      {
        title: 'Marca de entrada, qualidade de componentes variável',
        description: 'Modelo de baixo custo; alguns componentes (elétrica, acabamento) têm qualidade inferior a marcas japonesas.',
        severity: 'MEDIUM',
        symptom: 'Problemas elétricos intermitentes, acabamento desgastado precocemente.',
        inspectionTip: 'Testar toda a parte elétrica (luzes, buzina, painel) e observar o estado geral do acabamento.',
      },
      {
        title: 'Disponibilidade de peças e assistência',
        description: 'Rede de assistência técnica mais restrita que marcas estabelecidas.',
        severity: 'LOW',
        symptom: 'Dificuldade de encontrar oficina especializada.',
        inspectionTip: 'Perguntar onde o dono faz manutenção habitualmente.',
      },
    ],
  },
];

async function main() {
  console.log('🌱 Seed: catálogo de modelos e problemas conhecidos...');

  for (const model of CATALOG) {
    const created = await prisma.motorcycleModel.upsert({
      where: { brand_name: { brand: model.brand, name: model.name } },
      update: { category: model.category },
      create: { brand: model.brand, name: model.name, category: model.category },
    });

    // Recria os problemas conhecidos do modelo (idempotente).
    await prisma.knownIssue.deleteMany({ where: { modelId: created.id } });
    await prisma.knownIssue.createMany({
      data: model.issues.map((issue) => ({ ...issue, modelId: created.id })),
    });

    console.log(`  ✓ ${model.brand} ${model.name} (${model.issues.length} problemas)`);
  }

  console.log('✅ Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
