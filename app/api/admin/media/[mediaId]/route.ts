import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/api/session';
import { deleteMedia, getMediaList } from '@/lib/api/store';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> },
) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { mediaId } = await params;
  const existed = deleteMedia(mediaId);
  if (!existed) {
    return NextResponse.json(
      { ok: false, error: 'Media not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { ok: true, deleted: mediaId, remaining: getMediaList().length },
    { status: 200 },
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> },
) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { mediaId } = await params;
  const item = getMediaList().find((m) => m.id === mediaId);
  if (!item) {
    return NextResponse.json(
      { ok: false, error: 'Media not found' },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true, media: item }, { status: 200 });
}
