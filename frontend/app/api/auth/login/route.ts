import type { NextRequest } from 'next/server';
import { authenticate } from '@/lib/authCookie';

export async function POST(req: NextRequest): Promise<Response> {
  const { email, password } = await req.json();
  return authenticate('login', { email, password });
}
