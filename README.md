# Roteiro Entrega 1 - Projeto de Conclusão de Curso (ADS)

## 1. NOME DO PROJETO

**MotoCheck AI**

## 2. SUBTÍTULO DO PROJETO

Sistema inteligente de análise de anúncios e auxílio na compra de motocicletas usadas.

## 3. Participantes do Projeto

1. Pedro Gouveia

## 4. Definição do Problema

O mercado de motocicletas usadas, especialmente modelos de entrada como a Yamaha Factor 150 e a Honda CG 160 Fan, apresenta riscos para compradores que não possuem conhecimento técnico avançado. Anúncios em plataformas digitais frequentemente omitem problemas mecânicos, histórico de manutenção ou pendências documentais. A dificuldade em interpretar as entrelinhas de uma descrição textual impede que o comprador identifique riscos antes da visita presencial, resultando em perda de tempo e possíveis prejuízos financeiros.

## 5. Proposta de Solução

A solução é uma aplicação web que utiliza Inteligência Artificial para interpretar descrições de anúncios. O usuário fornece o texto do anúncio e a aplicação gera um relatório técnico estruturado.

**Escopo do MVP:**

- Interface para submissão manual do texto de anúncios (foco em agilidade de desenvolvimento).
- Processamento via LLM para identificar "red flags" (ex: motor aberto, problemas de documento, termos suspeitos).
- Dashboard de resultados com classificação de risco (Baixo, Médio, Alto).
- Gerador de perguntas estratégicas para o usuário fazer ao vendedor.
- Histórico de consultas salvas no perfil do usuário.

## 6. Proposta de Tecnologia (stack)

- **Frontend:** Next.js (App Router) e Tailwind CSS.
- **Backend:** NestJS.
- **ORM e Banco de Dados:** Prisma ORM com PostgreSQL.
- **Inteligência Artificial:** API do Google Gemini (1.5 Flash) ou OpenAI (GPT-4o-mini).

## 7. Cronograma

Planejamento semanal focado em janelas de 1h a 1,5h de desenvolvimento.

| Semana | Atividade Disciplina | Atividades do Projeto                                                                                        |
| :----- | :------------------- | :----------------------------------------------------------------------------------------------------------- |
| 24/04  | Mentoria             | Setup do projeto (Next.js + NestJS), repositório no Github e modelagem inicial do banco com Prisma.          |
| 08/05  | Mentoria             | Backend: Implementação do serviço de integração com a API de IA e configuração do prompt de análise técnica. |
| 15/05  | Seminário Andamento  | Frontend: Desenvolvimento da interface de submissão (input) e exibição básica da resposta.                   |
| 22/05  | Seminário Andamento  | Integração: Conectar o fluxo completo entre frontend, backend e IA.                                          |
| 29/05  | Mentoria             | Persistência: Criação do sistema de histórico de consultas no banco de dados.                                |
| 12/06  | Mentoria             | Refinamento UI/UX: Implementação de estados de carregamento e melhorias visuais no relatório.                |
| 19/06  | Mentoria             | Testes e Ajustes: Validação com anúncios reais e refinamento do prompt da IA.                                |
| 26/06  | Entrega 3            | Deploy da aplicação e fechamento da documentação técnica.                                                    |
| 03/07  | Apresentação Final   | Preparação dos slides e roteiro da apresentação.                                                             |
| 10/07  | Apresentação Final   | Ensaio técnico e revisão final.                                                                              |
| 17/07  | Apresentação Final   | Defesa do projeto.                                                                                           |
