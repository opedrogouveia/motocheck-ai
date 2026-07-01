"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { ComparisonRecommendation, ComparisonResult } from "@/lib/types";
import { useConversations } from "../ConversationsContext";
import { SidebarToggle } from "../SidebarContext";

const REC: Record<ComparisonRecommendation, { label: string; className: string }> = {
  RECOMMEND: { label: "Recomendada", className: "bg-green-100 text-green-700" },
  CONSIDER: { label: "Considerar", className: "bg-amber-100 text-amber-700" },
  AVOID: { label: "Evitar", className: "bg-red-100 text-red-700" },
};

export default function ComparePage() {
  const { conversations } = useConversations();
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  }

  async function compare() {
    if (selected.length < 2) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await api.compareConversations(selected));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="flex items-center gap-2 border-b border-border bg-surface px-3 py-3 sm:px-4">
        <SidebarToggle />
        <h2 className="min-w-0 flex-1 truncate font-semibold">Comparar motos</h2>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm text-muted">
            Selecione de 2 a 3 conversas e o agente vai comparar as motos, indicando a melhor
            escolha e a que evitar.
          </p>

          {conversations.length < 2 ? (
            <p className="mt-4 rounded-lg border border-border bg-surface p-4 text-sm text-muted">
              Você precisa de pelo menos duas conversas para comparar. Analise mais motos primeiro.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {conversations.map((c) => {
                const checked = selected.includes(c.id);
                const disabled = !checked && selected.length >= 3;
                return (
                  <li key={c.id}>
                    <label
                      className={`flex items-center gap-3 rounded-lg border p-3 text-sm transition ${
                        checked ? "border-brand bg-brand/5" : "border-border"
                      } ${disabled ? "opacity-50" : "cursor-pointer hover:bg-background"}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggle(c.id)}
                        className="h-4 w-4 accent-[var(--brand)]"
                      />
                      <span className="truncate">{c.title}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            onClick={() => void compare()}
            disabled={selected.length < 2 || loading}
            className="mt-4 rounded-lg btn-grad px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Comparando..." : `Comparar (${selected.length})`}
          </button>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}

          {result && (
            <div className="mt-6 flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-1 text-sm font-semibold">Conclusão</h3>
                <p className="text-sm leading-relaxed">{result.verdict}</p>
              </div>
              <ul className="flex flex-col gap-3">
                {result.items.map((it) => {
                  const rec = REC[it.recommendation];
                  const isBest = it.conversationId === result.bestConversationId;
                  return (
                    <li
                      key={it.conversationId}
                      className={`rounded-lg border bg-surface p-4 ${
                        isBest ? "border-brand" : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="min-w-0 truncate font-medium">
                          #{it.rank} — {it.title}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${rec.className}`}
                        >
                          {rec.label}
                        </span>
                      </div>
                      {it.reason && <p className="mt-2 text-sm text-muted">{it.reason}</p>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
