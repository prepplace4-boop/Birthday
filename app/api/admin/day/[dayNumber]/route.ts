import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/api/session';
import { DayContentUpdateSchema } from '@/lib/api/validators';
import { patchDay, getDayContent, getDayStatus } from '@/lib/api/store';
import { ZodError } from 'zod';
import type {
  TimelineItem,
  Memory,
  Envelope,
  MuseumRoom,
  FriendMessage,
  FinalLetter,
  FinalSurprise,
  DayContent,
} from '@/types';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ dayNumber: string }> },
) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { dayNumber: paramDay } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const payload = {
    ...(body as Record<string, unknown>),
    dayNumber: (body as Record<string, unknown>)?.dayNumber ?? paramDay,
  };

  let parsed;
  try {
    parsed = DayContentUpdateSchema.partial()
      .extend({
        dayNumber: DayContentUpdateSchema.shape.dayNumber,
      })
      .parse(payload);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: 'Invalid payload', issues: err.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: false, error: 'Invalid payload' },
      { status: 400 },
    );
  }

  const {
    dayNumber,
    timeline,
    memories,
    envelopes,
    rooms,
    letter,
    friendMessages,
    finalSurprise,
    ...rest
  } = parsed;

  const cleanLetter: Partial<FinalLetter> | undefined = letter
    ? {
        title: letter.title,
        content: letter.content,
        signature: letter.signature,
        audioUrl: letter.audioUrl ?? undefined,
      }
    : undefined;

  const day = patchDay(dayNumber, {
    ...rest,
    timeline: timeline as unknown as TimelineItem[] | undefined,
    memories: memories as unknown as Memory[] | undefined,
    envelopes: envelopes as unknown as Envelope[] | undefined,
    rooms: rooms as unknown as MuseumRoom[] | undefined,
    letter: cleanLetter,
    friendMessages: friendMessages as unknown as FriendMessage[] | undefined,
    finalSurprise: finalSurprise as unknown as
      | Partial<FinalSurprise>
      | Partial<FinalSurprise>[]
      | undefined,
  } as Partial<DayContent>);

  if (!day) {
    return NextResponse.json(
      { ok: false, error: 'Day not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, day }, { status: 200 });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ dayNumber: string }> },
) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { dayNumber: paramDay } = await params;
  const dayNumber = Number(paramDay);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 5) {
    return NextResponse.json({ ok: false, error: 'Invalid day number' }, { status: 400 });
  }

  const day = getDayStatus(dayNumber);
  const content = getDayContent(dayNumber);

  if (!day) {
    return NextResponse.json({ ok: false, error: 'Day not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, day, content }, { status: 200 });
}
