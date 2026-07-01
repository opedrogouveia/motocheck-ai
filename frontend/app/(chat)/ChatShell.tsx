"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ConversationsProvider } from "./ConversationsContext";
import { SidebarContext } from "./SidebarContext";
import Sidebar from "./Sidebar";

export default function ChatShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function toggle() {
    const isDesktop =
      typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) setCollapsed(!collapsed);
    else setMobileOpen(!mobileOpen);
  }

  async function handleLogout() {
    await api.logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <ConversationsProvider>
      <SidebarContext.Provider
        value={{ mobileOpen, collapsed, setMobileOpen, setCollapsed, toggle }}
      >
        <div className="flex h-screen w-full overflow-hidden">
          {/* Fundo escuro ao abrir a sidebar no mobile (toque fecha) */}
          {mobileOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
          )}
          <Sidebar onLogout={handleLogout} />
          <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {children}
          </section>
        </div>
      </SidebarContext.Provider>
    </ConversationsProvider>
  );
}
