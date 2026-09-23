import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hasReturned, getProgressSummary, getSettings } from '@/lib/api/store';

const GUEST_COOKIE = 'guest_session';

async function getGuestSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(GUEST_COOKIE);
  return cookie?.value ?? null;
}

export async function GET(_req: NextRequest) {
  try {
    const sessionId = await getGuestSessionId();
    const settings = getSettings();

    if (!sessionId) {
      return NextResponse.json({
        ok: true,
        data: {
          isReturning: false,
          progress: {
            percent: 0,
            completedDays: [],
            openedDays: [],
          },
          welcomeBackName: settings.herName,
        },
        error: null,
      });
    }

    const isReturning = hasReturned(sessionId);
    const progress = getProgressSummary(sessionId);

    return NextResponse.json({
      ok: true,
      data: {
        isReturning,
        progress,
        welcomeBackName: settings.herName,
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
