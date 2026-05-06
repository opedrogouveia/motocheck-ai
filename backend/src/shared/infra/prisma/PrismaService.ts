import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config'; // Força o Node a ler o seu arquivo .env

@Injectable()
export class PrismaService implements OnModuleInit {
  public client: PrismaClient;

  constructor() {
    // 1. Conecta no seu Supabase usando a URL do .env
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // 2. Cria o adaptador que o Prisma tanto quer
    const adapter = new PrismaPg(pool);

    // 3. Inicializa o Prisma entregando o adaptador pra ele ser feliz
    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}
