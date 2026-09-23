import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/api/session';
import { getProgressStats } from '@/lib/api/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const stats = getProgressStats();
  return NextResponse.json({ ok: true, ...stats }, { status: 200 });
}
