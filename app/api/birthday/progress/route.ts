import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ProgressUpdateSchema } from '@/lib/api/validators';
import {
  markDayOpened,
  markEnvelopeOpened,
  markRoomVisited,
  markFinalSurpriseViewed,
  computeAggregateProgress,
  getProgressSummary,
} from '@/lib/api/store';

const GUEST_COOKIE = 'guest_session';

async function getGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(GUEST_COOKIE);
  return cookie?.value ?? 'anonymous';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = ProgressUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          data: null,
          error: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const input = parsed.data;
    const sessionId = await getGuestSessionId();

    const dayToOpen = input.dayOpened ?? input.dayNumber;
    if (dayToOpen) {
      markDayOpened(sessionId, dayToOpen);
    }

    const envelopeToOpen = input.envelopeOpened ?? input.envelopeId;
    if (envelopeToOpen) {
      markEnvelopeOpened(sessionId, envelopeToOpen);
    }

    const roomToVisit = input.museumRoomVisited ?? input.museumRoomId;
    if (roomToVisit) {
      markRoomVisited(sessionId, roomToVisit);
    }

    if (input.finalSurpriseViewed) {
      markFinalSurpriseViewed(sessionId);
    }

    const progressPercent = computeAggregateProgress(sessionId);
    const summary = getProgressSummary(sessionId);

    return NextResponse.json({
      ok: true,
      data: {
        progressPercent,
        ...summary,
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
