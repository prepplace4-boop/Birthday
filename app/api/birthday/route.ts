import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getSettings,
  getAllDays,
  getProgressSummary,
  computeAggregateProgress,
} from '@/lib/api/store';

const GUEST_COOKIE = 'guest_session';

async function getGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(GUEST_COOKIE);
  return cookie?.value ?? 'anonymous';
}

export async function GET(_req: NextRequest) {
  try {
    const sessionId = await getGuestSessionId();
    const settings = getSettings();
    const allDays = getAllDays();

    const daySummaries = allDays.map((day) => ({
      id: day.id,
      dayNumber: day.dayNumber,
      title: day.title,
      subtitle: day.subtitle,
      locked: !day.isUnlocked,
      teaser: day.teaser,
      isUnlocked: day.isUnlocked,
    }));

    const progress = getProgressSummary(sessionId);
    const progressPercent = computeAggregateProgress(sessionId);

    return NextResponse.json({
      ok: true,
      data: {
        settings,
        days: daySummaries,
        progress: {
          ...progress,
          percent: progressPercent,
        },
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
