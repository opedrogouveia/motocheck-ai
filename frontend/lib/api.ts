// Cliente de API usado no browser. Fala só com o próprio Next (mesma origem):
// - /api/auth/*    -> login/registro/logout (setam o cookie httpOnly)
// - /api/backend/* -> proxy que repassa ao NestJS anexando o JWT do cookie
// Assim o token nunca fica acessível ao JavaScript do cliente.

import type {
  AuthUser,
  ComparisonResult,
  ConversationDetail,
  ConversationSummary,
  QuestionView,
  SendMessageResult,
} from './types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json();
      if (Array.isArray(body?.message)) message = body.message.join(' ');
      else if (typeof body?.message === 'string') message = body.message;
    } catch {
      // resposta sem corpo JSON
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // ---- Autenticação ----
  login: (email: string, password: string) =>
    request<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<{ user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),

  // ---- Conversas (via proxy) ----
  listConversations: () => request<ConversationSummary[]>('/api/backend/conversations'),

  createConversation: () =>
    request<ConversationSummary>('/api/backend/conversations', {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  getConversation: (id: string) =>
    request<ConversationDetail>(`/api/backend/conversations/${id}`),

  renameConversation: (id: string, title: string) =>
    request<ConversationSummary>(`/api/backend/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    }),

  deleteConversation: (id: string) =>
    request<{ message: string }>(`/api/backend/conversations/${id}`, { method: 'DELETE' }),

  sendMessage: (id: string, content: string) =>
    request<SendMessageResult>(`/api/backend/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  answerQuestion: (id: string, questionId: string, answer: string) =>
    request<QuestionView>(`/api/backend/conversations/${id}/questions/${questionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ answer }),
    }),

  compareConversations: (conversationIds: string[]) =>
    request<ComparisonResult>('/api/backend/conversations/compare', {
      method: 'POST',
      body: JSON.stringify({ conversationIds }),
    }),
};
