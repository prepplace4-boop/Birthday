import { NextRequest, NextResponse } from 'next/server';
import { getAllDays } from '@/lib/api/store';

export async function GET(_req: NextRequest) {
  try {
    const allDays = getAllDays();

    const daySummaries = allDays.map((day) => ({
      id: day.id,
      dayNumber: day.dayNumber,
      title: day.title,
      subtitle: day.subtitle,
      locked: !day.isUnlocked,
      teaser: day.teaser,
      isUnlocked: day.isUnlocked,
      unlockTime: day.unlockTime,
    }));

    return NextResponse.json({
      ok: true,
      data: daySummaries,
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
