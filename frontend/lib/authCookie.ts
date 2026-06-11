// Helpers de servidor para autenticação contra o backend NestJS.
import { cookies } from 'next/headers';

export const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';
export const TOKEN_COOKIE = 'token';

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function setTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SEVEN_DAYS,
  });
}

export async function clearTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
}

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

/** Encaminha credenciais ao backend (login/register) e seta o cookie. */
export async function authenticate(
  endpoint: 'login' | 'register',
  payload: Record<string, unknown>,
): Promise<Response> {
  let upstream: Response;
  try {
    upstream = await fetch(`${BACKEND_URL}/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return Response.json(
      { message: 'Backend indisponível. O servidor NestJS está rodando?' },
      { status: 502 },
    );
  }

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return Response.json(data, { status: upstream.status });
  }

  await setTokenCookie(data.accessToken);
  return Response.json({ user: data.user });
}
