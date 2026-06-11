import { clearTokenCookie } from '@/lib/authCookie';

export async function POST(): Promise<Response> {
  await clearTokenCookie();
  return Response.json({ ok: true });
}
