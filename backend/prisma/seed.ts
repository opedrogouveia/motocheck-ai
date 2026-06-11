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
