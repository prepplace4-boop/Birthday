import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureDayUnlocked } from '@/lib/api/guards';
import {
  getDayContent,
  markDayOpened,
} from '@/lib/api/store';

const GUEST_COOKIE = 'guest_session';

async function getGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(GUEST_COOKIE);
  return cookie?.value ?? 'anonymous';
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ dayNumber: string }> },
) {
  try {
    const { dayNumber: dayNumberStr } = await params;
    const dayNumber = parseInt(dayNumberStr, 10);

    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 5) {
      return NextResponse.json(
        { ok: false, data: null, error: 'Invalid day number. Must be 1-5.' },
        { status: 400 },
      );
    }

    const result = ensureDayUnlocked(dayNumber);

    if (result.locked) {
      return NextResponse.json({
        ok: true,
        data: {
          day: result.dayNumber,
          locked: true as const,
          teaser: result.teaser,
        },
        error: null,
      });
    }

    const sessionId = await getGuestSessionId();
    markDayOpened(sessionId, dayNumber);

    const day = result.day;
    const content = getDayContent(dayNumber);

    return NextResponse.json({
      ok: true,
      data: {
        dayNumber,
        locked: false as const,
        dayInfo: {
          id: day.id,
          dayNumber: day.dayNumber,
          title: day.title,
          subtitle: day.subtitle,
        },
        content,
      },
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, data: null, error: message },
      { status: 500 },
    );
  }
}
