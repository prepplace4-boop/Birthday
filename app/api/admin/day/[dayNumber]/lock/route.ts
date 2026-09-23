import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/api/session';
import { DayUnlockSchema } from '@/lib/api/validators';
import { setDayUnlocked } from '@/lib/api/store';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ dayNumber: string }> },
) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { dayNumber: paramDay } = await params;
  const body = await req.json().catch(() => ({}));
  const payload = {
    dayNumber: body?.dayNumber ?? paramDay,
  };

  const parsed = DayUnlockSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid day number', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const day = setDayUnlocked(parsed.data.dayNumber, false);
  if (!day) {
    return NextResponse.json(
      { ok: false, error: 'Day not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, day }, { status: 200 });
}
