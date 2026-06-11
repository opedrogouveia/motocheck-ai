import type { NextRequest } from 'next/server';
import { authenticate } from '@/lib/authCookie';

export async function POST(req: NextRequest): Promise<Response> {
  const { name, email, password } = await req.json();
  return authenticate('register', { name, email, password });
}
