// Tipos compartilhados do frontend — espelham o que o backend retorna.

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type Role = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageView {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  analysisId: string | null;
}

export interface RedFlag {
  id: string;
  category: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Recommendation {
  id: string;
  text: string;
  type: string | null;
}

export interface AnalysisView {
  id: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  summary: string;
  createdAt: string;
  redFlags: RedFlag[];
  recommendations: Recommendation[];
}

export interface QuestionView {
  id: string;
  question: string;
  answer: string | null;
  status: 'PENDING' | 'ANSWERED' | 'SKIPPED';
  createdAt: string;
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

export interface SendMessageResult {
  userMessage: MessageView;
  assistantMessage: MessageView;
  analysis: AnalysisView | null;
  motorcycle: MotorcycleView | null;
  suggestedQuestions: QuestionView[];
  newTitle: string | null;
}
