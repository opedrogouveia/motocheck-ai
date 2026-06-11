import { AgentMotorcycle } from '../../ai/llm/agent.types';

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageView {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: Date;
  analysisId: string | null;
}

export interface RedFlagView {
  id: string;
  category: string;
  description: string;
  severity: string;
}

export interface RecommendationView {
  id: string;
  text: string;
  type: string | null;
}

export interface AnalysisView {
  id: string;
  riskLevel: string;
  summary: string;
  createdAt: Date;
  redFlags: RedFlagView[];
  recommendations: RecommendationView[];
}

export interface QuestionView {
  id: string;
  question: string;
  answer: string | null;
  status: string;
  createdAt: Date;
}

export interface MotorcycleView {
  brand: string | null;
  model: string | null;
  year: number | null;
  mileageKm: number | null;
  priceBRL: number | null;
  location: string | null;
  sellerType: string | null;
}

export interface ConversationDetail extends ConversationSummary {
  messages: MessageView[];
  motorcycle: MotorcycleView | null;
  latestAnalysis: AnalysisView | null;
  suggestedQuestions: QuestionView[];
}

/** Dados já preparados pelo use case para persistir o turno do agente. */
export interface SaveAgentTurnParams {
  conversationId: string;
  reply: string;
  model: string;
  usage: { input: number; output: number };
  analysis: {
    riskLevel: string;
    summary: string;
    redFlags: { category: string; description: string; severity: string }[];
    recommendations: { text: string; type?: string }[];
  } | null;
  newQuestions: string[];
  motorcycle: AgentMotorcycle | null;
  modelCatalogId: string | null;
  newTitle: string | null;
}

export interface SaveAgentTurnResult {
  assistantMessage: MessageView;
  analysis: AnalysisView | null;
  motorcycle: MotorcycleView | null;
  suggestedQuestions: QuestionView[];
}
