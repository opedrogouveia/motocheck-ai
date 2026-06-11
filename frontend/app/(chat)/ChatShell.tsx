"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ConversationsProvider } from "./ConversationsContext";
import Sidebar from "./Sidebar";

export default function ChatShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await api.logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <ConversationsProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar onLogout={handleLogout} />
        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </section>
      </div>
    </ConversationsProvider>
  );
}
