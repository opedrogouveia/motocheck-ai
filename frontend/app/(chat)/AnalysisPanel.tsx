"use client";

import { useState } from "react";
import type { AnalysisView, MotorcycleView, QuestionView } from "@/lib/types";

const RISK_STYLE: Record<string, { label: string; className: string }> = {
  LOW: { label: "Risco baixo", className: "bg-green-100 text-green-700" },
  MEDIUM: { label: "Risco médio", className: "bg-amber-100 text-amber-700" },
  HIGH: { label: "Risco alto", className: "bg-red-100 text-red-700" },
};

const SEVERITY_DOT: Record<string, string> = {
  LOW: "bg-green-500",
  MEDIUM: "bg-amber-500",
  HIGH: "bg-orange-500",
  CRITICAL: "bg-red-600",
};

interface Props {
  analysis: AnalysisView | null;
  motorcycle: MotorcycleView | null;
  questions: QuestionView[];
  onAnswer: (questionId: string, answer: string) => Promise<void>;
  onContinue: () => void;
  sending: boolean;
}

export default function AnalysisPanel({
  analysis,
  motorcycle,
  questions,
  onAnswer,
  onContinue,
  sending,
}: Props) {
  if (!analysis && !motorcycle && questions.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-4 text-sm text-muted">
        A análise aparecerá aqui assim que você enviar um anúncio.
      </div>
    );
  }

  const risk = analysis ? RISK_STYLE[analysis.riskLevel] : null;
  const hasAnswers = questions.some((q) => q.status === "ANSWERED");

  const showPinned = !!motorcycle || !!(analysis && risk);

  return (
    <div className="flex h-full flex-col">
      {/* Topo FIXO: moto + risco sempre visíveis (não rolam) */}
      {showPinned && (
        <div className="shrink-0 space-y-3 border-b border-border p-4">
          {motorcycle && <MotorcycleCard motorcycle={motorcycle} />}
          {analysis && risk && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Risco da compra:</span>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${risk.className}`}
              >
                {risk.label}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Corpo ROLÁVEL: resumo, alertas, recomendações, perguntas */}
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
        {analysis && <p className="text-sm leading-relaxed">{analysis.summary}</p>}

        {analysis && analysis.redFlags.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold">Sinais de alerta</h3>
          <ul className="flex flex-col gap-2">
            {analysis.redFlags.map((f) => (
              <li key={f.id} className="rounded-lg border border-border bg-surface p-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${SEVERITY_DOT[f.severity] ?? "bg-gray-400"}`} />
                  <span className="font-medium">{f.category}</span>
                </div>
                <p className="mt-1 text-muted">{f.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {analysis && analysis.recommendations.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold">Recomendações</h3>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted">
            {analysis.recommendations.map((r) => (
              <li key={r.id}>{r.text}</li>
            ))}
          </ul>
        </section>
      )}

      {questions.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold">Perguntas ao vendedor</h3>
          <ul className="flex flex-col gap-3">
            {questions.map((q) => (
              <QuestionItem key={q.id} question={q} onAnswer={onAnswer} />
            ))}
          </ul>

          <button
            onClick={onContinue}
            disabled={sending || !hasAnswers}
            title={!hasAnswers ? "Responda ao menos uma pergunta para continuar" : undefined}
            className="mt-3 w-full rounded-lg btn-grad py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Atualizando..." : "Continuar análise"}
          </button>
        </section>
      )}
      </div>
    </div>
  );
}

function MotorcycleCard({ motorcycle }: { motorcycle: MotorcycleView }) {
  const rows: [string, string | number | null][] = [
    ["Marca", motorcycle.brand],
    ["Modelo", motorcycle.model],
    ["Ano", motorcycle.year],
    ["KM", motorcycle.mileageKm],
    ["Preço", motorcycle.priceBRL != null ? `R$ ${motorcycle.priceBRL.toLocaleString("pt-BR")}` : null],
    ["Local", motorcycle.location],
  ];
  const filled = rows.filter(([, v]) => v != null && v !== "");
  if (filled.length === 0) return null;

  return (
    <section className="rounded-lg border border-border bg-surface p-3">
      <h3 className="mb-2 text-sm font-semibold">Moto</h3>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
        {filled.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-2">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function QuestionItem({
  question,
  onAnswer,
}: {
  question: QuestionView;
  onAnswer: (id: string, answer: string) => Promise<void>;
}) {
  const [answer, setAnswer] = useState(question.answer ?? "");
  const [saving, setSaving] = useState(false);
  const answered = question.status === "ANSWERED";

  async function save() {
    if (!answer.trim()) return;
    setSaving(true);
    try {
      await onAnswer(question.id, answer.trim());
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="rounded-lg border border-border bg-surface p-3 text-sm">
      <p className="font-medium">{question.question}</p>
      {answered ? (
        <p className="mt-1 rounded bg-green-50 p-2 text-green-700">
          Resposta do vendedor: {question.answer}
        </p>
      ) : (
        <div className="mt-2 flex gap-2">
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void save();
              }
            }}
            placeholder="Resposta do vendedor..."
            className="flex-1 rounded border border-border bg-background px-2 py-1 outline-none focus:border-brand"
          />
          <button
            onClick={() => void save()}
            disabled={saving}
            className="rounded btn-grad px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
          >
            {saving ? "..." : "Salvar"}
          </button>
        </div>
      )}
    </li>
  );
}
