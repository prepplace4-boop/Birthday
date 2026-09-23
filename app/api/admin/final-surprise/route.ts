import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/api/session';
import { FinalSurpriseUpdateSchema } from '@/lib/api/validators';
import { updateDay5FinalSurprise, getDayStatus, getDay5FinalSurprise } from '@/lib/api/store';
import type { FinalSurprise } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const day5 = getDayStatus(5);
  const finalSurprise = getDay5FinalSurprise();
  return NextResponse.json(
    { ok: true, finalSurprises: finalSurprise ? [finalSurprise] : day5?.finalSurprises ?? [] },
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

  const parsed = FinalSurpriseUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid final surprise payload',
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const raw = parsed.data as Record<string, unknown>;
  const clean: Partial<FinalSurprise> = {};
  if ('type' in raw) clean.type = raw.type as FinalSurprise['type'];
  if ('title' in raw) clean.title = raw.title as string;
  if ('content' in raw) clean.content = raw.content as string;
  if ('url' in raw) clean.url = raw.url === null ? undefined : (raw.url as string);
  if ('mediaUrl' in raw) clean.mediaUrl = raw.mediaUrl === null ? undefined : (raw.mediaUrl as string);

  const required = clean.type && clean.title && clean.content;
  if (!required) {
    return NextResponse.json(
      { ok: false, error: 'Final surprise requires type, title, and content' },
      { status: 400 },
    );
  }

  const surprise: FinalSurprise = {
    type: clean.type as FinalSurprise['type'],
    title: clean.title as string,
    content: clean.content as string,
    url: clean.url,
    mediaUrl: clean.mediaUrl,
  };

  updateDay5FinalSurprise(surprise);
  return NextResponse.json(
    { ok: true, finalSurprises: [surprise] },
    { status: 200 },
  );
}
