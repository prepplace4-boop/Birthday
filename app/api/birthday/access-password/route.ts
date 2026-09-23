import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AccessPasswordSchema } from '@/lib/api/validators';
import {
  getSettings,
  getAccessPasswordHash,
  grantAccess,
} from '@/lib/api/store';
import { compareSync } from 'bcryptjs';

const GUEST_COOKIE = 'guest_session';
const ACCESS_GRANT_COOKIE = 'access_granted';

async function getGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(GUEST_COOKIE);
  return cookie?.value ?? 'anonymous';
}

export async function POST(req: NextRequest) {
  try {
    const settings = getSettings();

    if (!settings.accessPasswordEnabled) {
      return NextResponse.json({
        ok: true,
        data: { granted: true, message: 'Access is open.' },
        error: null,
      });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = AccessPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          data: null,
          error: 'Password is required.',
        },
        { status: 400 },
      );
    }

    const storedHash = getAccessPasswordHash();
    if (!storedHash) {
      return NextResponse.json({
        ok: true,
        data: { granted: true, message: 'No password set.' },
        error: null,
      });
    }

    const isMatch = compareSync(parsed.data.password, storedHash);
    if (!isMatch) {
      return NextResponse.json(
        {
          ok: false,
          data: null,
          error: 'Incorrect password.',
        },
        { status: 401 },
      );
    }

    const sessionId = await getGuestSessionId();
    grantAccess(sessionId);

    const res = NextResponse.json({
      ok: true,
      data: { granted: true, message: 'Access granted.' },
      error: null,
    });

    res.cookies.set(ACCESS_GRANT_COOKIE, 'true', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, data: null, error: message },
      { status: 500 },
    );
  }
}
