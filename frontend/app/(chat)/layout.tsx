import { redirect } from "next/navigation";
import { getToken } from "@/lib/authCookie";
import ChatShell from "./ChatShell";

// Layout SERVER-SIDE: protege todo o grupo (chat).
// Se não houver cookie de sessão, redireciona para /login antes de renderizar.
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  if (!token) redirect("/login");

  return <ChatShell>{children}</ChatShell>;
}
