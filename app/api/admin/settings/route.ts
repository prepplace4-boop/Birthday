import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/api/session';
import { SettingsUpdateSchema } from '@/lib/api/validators';
import { patchSettings, getSettings } from '@/lib/api/store';
import type { JourneySettings } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  return NextResponse.json(
    { ok: true, settings: getSettings() },
    { status: 200 },
  );
}

export async function PUT(req: NextRequest) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const parsed = SettingsUpdateSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid settings payload',
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const raw = parsed.data as Record<string, unknown>;
  const update: Partial<JourneySettings> = {};
  if ('herName' in raw) update.herName = raw.herName as string;
  if ('yourName' in raw) update.yourName = raw.yourName as string;
  if ('birthdayDate' in raw) update.birthdayDate = raw.birthdayDate as string;
  if ('theme' in raw) update.theme = raw.theme as string;
  if ('background' in raw) update.background = raw.background as string;
  if ('musicUrl' in raw) update.musicUrl = raw.musicUrl as string;
  if ('musicVolume' in raw) update.musicVolume = raw.musicVolume as number;
  if ('musicDay' in raw) update.musicDay = raw.musicDay === null ? undefined : (raw.musicDay as number);
  if ('accessPasswordEnabled' in raw) update.accessPasswordEnabled = raw.accessPasswordEnabled as boolean;
  if ('accessPasswordHash' in raw) update.accessPasswordHash = raw.accessPasswordHash === null ? undefined : (raw.accessPasswordHash as string);
  if ('journeyStatus' in raw) update.journeyStatus = raw.journeyStatus as JourneySettings['journeyStatus'];
  if ('introText' in raw) update.introText = raw.introText as string;
  if ('finalMessage' in raw) update.finalMessage = raw.finalMessage as string;

  const settings = patchSettings(update);
  return NextResponse.json({ ok: true, settings }, { status: 200 });
}
