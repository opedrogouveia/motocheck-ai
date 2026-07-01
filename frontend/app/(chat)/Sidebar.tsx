"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ConversationSummary } from "@/lib/types";
import { useConversations } from "./ConversationsContext";
import { useSidebar } from "./SidebarContext";
import Modal from "./Modal";

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  const { conversations, loading, createAndOpen, remove, rename } = useConversations();
  const { mobileOpen, collapsed, setMobileOpen, toggle } = useSidebar();
  const params = useParams<{ id?: string }>();
  const activeId = params?.id;

  const closeOnMobile = () => setMobileOpen(false);

  const [renameTarget, setRenameTarget] = useState<ConversationSummary | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ConversationSummary | null>(null);
  const [busy, setBusy] = useState(false);

  function openRename(c: ConversationSummary) {
    setRenameValue(c.title);
    setRenameTarget(c);
  }

  async function confirmRename() {
    if (!renameTarget || !renameValue.trim()) return;
    setBusy(true);
    try {
      await rename(renameTarget.id, renameValue.trim());
      setRenameTarget(null);
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col border-r border-border bg-surface transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:shrink-0 lg:translate-x-0 lg:transition-[width] lg:duration-200 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${collapsed ? "lg:w-0 lg:overflow-hidden lg:border-r-0" : "lg:w-72"}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" onClick={closeOnMobile} className="text-lg font-bold">
            MotoCheck <span className="text-brand">AI</span>
          </Link>
          <button
            onClick={toggle}
            aria-label="Esconder a barra lateral"
            title="Esconder"
            className="shrink-0 rounded-lg p-1.5 text-muted transition hover:bg-background"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => {
            void createAndOpen();
            closeOnMobile();
          }}
          className="mt-3 w-full rounded-lg btn-grad py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          + Nova conversa
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        {loading && <p className="px-2 text-sm text-muted">Carregando...</p>}
        {!loading && conversations.length === 0 && (
          <p className="px-2 text-sm text-muted">Nenhuma conversa ainda.</p>
        )}
        <ul className="flex flex-col gap-1">
          {conversations.map((c) => (
            <li key={c.id}>
              <div
                className={`group flex items-center gap-1 rounded-lg px-2 py-2 text-sm transition ${
                  c.id === activeId ? "bg-brand/10 text-brand" : "hover:bg-background"
                }`}
              >
                <Link href={`/c/${c.id}`} onClick={closeOnMobile} className="flex-1 truncate">
                  {c.title}
                </Link>
                <button
                  onClick={() => openRename(c)}
                  className="opacity-0 transition group-hover:opacity-100 hover:text-brand"
                  title="Renomear"
                  aria-label="Renomear conversa"
                >
                  ✎
                </button>
                <button
                  onClick={() => setDeleteTarget(c)}
                  className="opacity-0 transition group-hover:opacity-100 hover:text-red-600"
                  title="Excluir"
                  aria-label="Excluir conversa"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={onLogout}
          className="w-full rounded-lg border border-border py-2 text-sm text-muted transition hover:bg-background"
        >
          Sair
        </button>
      </div>

      {/* Modal: renomear */}
      <Modal open={!!renameTarget} onClose={() => !busy && setRenameTarget(null)} title="Renomear conversa">
        <input
          autoFocus
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void confirmRename();
            }
          }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
          placeholder="Nome da conversa"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => setRenameTarget(null)}
            disabled={busy}
            className="rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-background disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={() => void confirmRename()}
            disabled={busy || !renameValue.trim()}
            className="rounded-lg btn-grad px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </Modal>

      {/* Modal: excluir */}
      <Modal open={!!deleteTarget} onClose={() => !busy && setDeleteTarget(null)} title="Excluir conversa">
        <p className="text-sm text-muted">
          Tem certeza que deseja excluir{" "}
          <span className="font-medium text-foreground">{deleteTarget?.title}</span>? Essa ação não
          pode ser desfeita.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => setDeleteTarget(null)}
            disabled={busy}
            className="rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-background disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={() => void confirmDelete()}
            disabled={busy}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {busy ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </Modal>
    </aside>
  );
}
