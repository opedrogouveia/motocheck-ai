"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type {
  AnalysisView,
  MessageView,
  MotorcycleView,
  QuestionView,
} from "@/lib/types";
import { useConversations } from "../../ConversationsContext";
import { SidebarToggle } from "../../SidebarContext";
import AnalysisPanel from "../../AnalysisPanel";

const CONTINUE_PROMPT =
  "Já respondi algumas das perguntas ao vendedor. Atualize a análise de risco e as recomendações considerando essas respostas. As perguntas que ficaram sem resposta NÃO foram respondidas — não assuma respostas para elas; apenas siga com o que há, deixe claro o que ainda é incerto e me diga o nível de risco atual e os próximos passos.";

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { refresh } = useConversations();

  const [title, setTitle] = useState("Conversa");
  const [messages, setMessages] = useState<MessageView[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisView | null>(null);
  const [motorcycle, setMotorcycle] = useState<MotorcycleView | null>(null);
  const [questions, setQuestions] = useState<QuestionView[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Carrega a conversa ao abrir / trocar de id.
  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getConversation(id)
      .then((detail) => {
        if (!active) return;
        setTitle(detail.title);
        setMessages(detail.messages);
        setAnalysis(detail.latestAnalysis);
        setMotorcycle(detail.motorcycle);
        setQuestions(detail.suggestedQuestions);
        setError(null);
      })
      .catch((e) => active && setError((e as Error).message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Esc fecha o painel de análise no mobile; se já estiver fechado, volta
  // para a home ("Iniciar nova análise"). Não dispara se um modal (que
  // intercepta o Esc na fase de captura) estiver aberto.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (showPanel) {
        setShowPanel(false);
        return;
      }
      router.push("/");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPanel, router]);

  const send = useCallback(async (override?: string) => {
    const content = (override ?? input).trim();
    if (!content || sending) return;

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "USER", content, createdAt: new Date().toISOString(), analysisId: null },
    ]);
    if (!override) setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await api.sendMessage(id, content);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempId),
        res.userMessage,
        res.assistantMessage,
      ]);
      if (res.analysis) setAnalysis(res.analysis);
      if (res.motorcycle) setMotorcycle(res.motorcycle);
      setQuestions(res.suggestedQuestions);
      if (res.newTitle) {
        setTitle(res.newTitle);
        void refresh();
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }, [input, sending, id, refresh]);

  const handleAnswer = useCallback(
    async (questionId: string, answer: string) => {
      const updated = await api.answerQuestion(id, questionId, answer);
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? updated : q)));
    },
    [id],
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <>
      {/* Cabeçalho */}
      <header className="flex items-center gap-2 border-b border-border bg-surface px-3 py-3 sm:px-4">
        <SidebarToggle />
        <h2 className="min-w-0 flex-1 truncate font-semibold">{title}</h2>
        <button
          onClick={() => setShowPanel((v) => !v)}
          className="shrink-0 rounded-lg border border-border px-3 py-1 text-sm lg:hidden"
        >
          {showPanel ? "Fechar" : "Análise"}
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Coluna do chat */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {loading && <p className="text-sm text-muted">Carregando...</p>}
            {!loading && messages.length === 0 && (
              <div className="mx-auto mt-10 max-w-md text-center text-muted">
                <p className="text-lg font-medium text-foreground">Cole o anúncio da moto 🏍️</p>
                <p className="mt-2 text-sm">
                  Envie o texto do anúncio (com preço, ano, km, descrição) e eu farei a análise
                  de risco e sugerirei perguntas para o vendedor.
                </p>
              </div>
            )}

            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {sending && (
                <div className="self-start rounded-2xl bg-surface px-4 py-3 text-sm text-muted">
                  Analisando...
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {error && (
            <p className="border-t border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Composer */}
          <div className="border-t border-border bg-surface p-3">
            <div className="mx-auto flex max-w-2xl items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Cole o anúncio ou escreva uma mensagem..."
                className="max-h-40 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <button
                onClick={() => void send()}
                disabled={sending || !input.trim()}
                className="rounded-lg btn-grad px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Painel de análise (fixo em telas grandes) */}
        <aside className="hidden w-96 shrink-0 border-l border-border bg-background lg:flex lg:flex-col lg:overflow-hidden">
          <AnalysisPanel
            analysis={analysis}
            motorcycle={motorcycle}
            questions={questions}
            onAnswer={handleAnswer}
            onContinue={() => void send(CONTINUE_PROMPT)}
            sending={sending}
          />
        </aside>

        {/* Painel como overlay em telas pequenas */}
        {showPanel && (
          <div className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-background lg:hidden">
            <AnalysisPanel
              analysis={analysis}
              motorcycle={motorcycle}
              questions={questions}
              onAnswer={handleAnswer}
              onContinue={() => void send(CONTINUE_PROMPT)}
              sending={sending}
            />
          </div>
        )}
      </div>
    </>
  );
}

function MessageBubble({ message }: { message: MessageView }) {
  const isUser = message.role === "USER";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-brand text-white"
            : "border border-border bg-surface text-foreground"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
