import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const SECRET = process.env.SECRET ?? 'dev-secret';
export const ADMIN_COOKIE = 'admin_session';
export const GUEST_COOKIE = 'guest_session';
export const ADMIN_SESSION_TTL_SEC = 60 * 60 * 24 * 7;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256Hex(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return bytesToHex(new Uint8Array(signature));
}

export async function sign(value: string, secret: string): Promise<string> {
  return `${value}.${await hmacSha256Hex(secret, value)}`;
}

export async function verify(signed: string, secret: string): Promise<string | null> {
  const idx = signed.lastIndexOf('.');
  if (idx === -1) return null;

  const value = signed.slice(0, idx);
  const givenSignature = signed.slice(idx + 1);
  const expected = await hmacSha256Hex(secret, value);

  const a = new TextEncoder().encode(givenSignature);
  const b = new TextEncoder().encode(expected);
  if (a.length !== b.length) return null;

  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i];
  return mismatch === 0 ? value : null;
}

export async function verifyAdminSessionFromCookie(
  cookieValue: string | undefined,
): Promise<string | null> {
  if (!cookieValue) return null;
  return verify(cookieValue, SECRET);
}

export async function requireAdminSession(
  res: typeof NextResponse = NextResponse,
): Promise<Response | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE)?.value;
  const sessionId = await verifyAdminSessionFromCookie(cookieValue);
  if (!sessionId) {
    return res.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function setAdminSessionCookie(
  response: NextResponse,
  sessionId: string,
): Promise<NextResponse> {
  const signed = await sign(sessionId, SECRET);
  response.cookies.set(ADMIN_COOKIE, signed, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SEC,
  });
  return response;
}

export function clearAdminSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
