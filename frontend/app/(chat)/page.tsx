"use client";

import { useConversations } from "./ConversationsContext";

export default function Home() {
  const { createAndOpen } = useConversations();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold">
        MotoCheck <span className="text-brand">AI</span>
      </h1>
      <p className="mt-3 max-w-md text-muted">
        Seu especialista em motos usadas. Cole o texto de um anúncio e receba uma
        análise de risco, alertas e perguntas para fazer ao vendedor.
      </p>
      <button
        onClick={() => void createAndOpen()}
        className="mt-6 rounded-lg btn-grad px-6 py-3 font-medium text-white transition hover:opacity-90"
      >
        Iniciar nova análise
      </button>
    </div>
  );
}
