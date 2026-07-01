"use client";

import { createContext, useContext } from "react";

export interface SidebarState {
  /** Sidebar aberta como drawer no mobile. */
  mobileOpen: boolean;
  /** Sidebar recolhida no desktop. */
  collapsed: boolean;
  setMobileOpen: (v: boolean) => void;
  setCollapsed: (v: boolean) => void;
  /** Recolhe/expande no desktop; abre/fecha no mobile. */
  toggle: () => void;
}

export const SidebarContext = createContext<SidebarState | null>(null);

export function useSidebar(): SidebarState {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar precisa estar dentro de ChatShell");
  return ctx;
}

/** Botão hambúrguer para mostrar/esconder a sidebar (usado nos cabeçalhos). */
export function SidebarToggle({ className = "" }: { className?: string }) {
  const { toggle } = useSidebar();
  return (
    <button
      onClick={toggle}
      aria-label="Mostrar ou esconder a barra lateral"
      title="Mostrar/esconder conversas"
      className={`shrink-0 rounded-lg border border-border p-2 text-muted transition hover:bg-background ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}
