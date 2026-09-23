import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/api/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}

export async function GET(req: NextRequest) {
  return POST(req);
}
