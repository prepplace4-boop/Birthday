import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/api/session';
import { MediaUploadMetaSchema } from '@/lib/api/validators';
import { addMedia, getMediaList } from '@/lib/api/store';
import type { MediaVisibility } from '@/types';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
]);

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const dayNumberParam = searchParams.get('dayNumber');
  const section = searchParams.get('section') ?? undefined;
  const visibility = searchParams.get('visibility') ?? undefined;

  const filters: {
    dayNumber?: number;
    section?: string;
    visibility?: MediaVisibility;
  } = {};
  if (dayNumberParam) {
    const n = Number(dayNumberParam);
    if (!Number.isNaN(n) && n >= 1 && n <= 5) filters.dayNumber = n;
  }
  if (section) filters.section = section;
  if (visibility) filters.visibility = visibility as MediaVisibility;

  return NextResponse.json(
    { ok: true, media: getMediaList(filters) },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    return NextResponse.json(
      { ok: false, error: 'Expected multipart/form-data' },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to parse multipart form' },
      { status: 400 },
    );
  }

  const file = formData.get('file') as File | null;
  const metaRaw = formData.get('meta');

  if (!file) {
    return NextResponse.json(
      { ok: false, error: 'Missing file field' },
      { status: 400 },
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        ok: false,
        error: `File type not allowed. Only: ${Array.from(ALLOWED_MIME_TYPES).join(', ')}`,
      },
      { status: 400 },
    );
  }

  const extBlacklist = [
    '.exe',
    '.bat',
    '.cmd',
    '.sh',
    '.ps1',
    '.js',
    '.vbs',
    '.msi',
  ];
  const lowerName = file.name.toLowerCase();
  for (const ext of extBlacklist) {
    if (lowerName.endsWith(ext)) {
      return NextResponse.json(
        { ok: false, error: 'File extension not allowed' },
        { status: 400 },
      );
    }
  }

  let metaParsed: unknown;
  try {
    if (typeof metaRaw === 'string') {
      metaParsed = JSON.parse(metaRaw);
    } else if (metaRaw instanceof File) {
      const text = await metaRaw.text();
      metaParsed = JSON.parse(text);
    } else {
      const metaObj: Record<string, FormDataEntryValue | null> = {};
      for (const [k, v] of formData.entries()) {
        if (k !== 'file') metaObj[k] = v;
      }
      metaParsed = metaObj;
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid meta JSON' },
      { status: 400 },
    );
  }

  const metaRes = MediaUploadMetaSchema.safeParse(metaParsed);
  if (!metaRes.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid media metadata invalid',
        issues: metaRes.error.flatten(),
      },
      { status: 400 },
    );
  }

  let dataUrl: string;
  try {
    dataUrl = await fileToDataURL(file);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Failed to read file' },
      { status: 500 },
    );
  }

  const media = addMedia({
    id: crypto.randomUUID(),
    storageKey: `inmemory::${file.name}::${Date.now()}`,
    url: dataUrl,
    mimeType: file.type,
    sizeBytes: file.size,
    title: metaRes.data.title,
    description: metaRes.data.description,
    dayNumber: metaRes.data.dayNumber,
    section: metaRes.data.section,
    displayOrder: metaRes.data.displayOrder,
    visibility: metaRes.data.visibility,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, media }, { status: 201 });
}
