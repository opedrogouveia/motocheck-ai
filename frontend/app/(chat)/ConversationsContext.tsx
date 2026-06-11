"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { ConversationSummary } from "@/lib/types";

interface ConversationsContextValue {
  conversations: ConversationSummary[];
  loading: boolean;
  refresh: () => Promise<void>;
  createAndOpen: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  rename: (id: string, title: string) => Promise<void>;
}

const ConversationsContext = createContext<ConversationsContextValue | null>(null);

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setConversations(await api.listConversations());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createAndOpen = useCallback(async () => {
    const created = await api.createConversation();
    await refresh();
    router.push(`/c/${created.id}`);
  }, [refresh, router]);

  const remove = useCallback(
    async (id: string) => {
      await api.deleteConversation(id);
      await refresh();
      router.push("/");
    },
    [refresh, router],
  );

  const rename = useCallback(
    async (id: string, title: string) => {
      await api.renameConversation(id, title);
      await refresh();
    },
    [refresh],
  );

  return (
    <ConversationsContext.Provider
      value={{ conversations, loading, refresh, createAndOpen, remove, rename }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations(): ConversationsContextValue {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversations precisa estar dentro de ConversationsProvider");
  return ctx;
}
