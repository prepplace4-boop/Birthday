import { NextResponse, NextRequest } from 'next/server';
import {
  SECRET,
  ADMIN_COOKIE,
  GUEST_COOKIE,
  sign,
  verify,
  ADMIN_SESSION_TTL_SEC,
} from './lib/api/session';

const ADMIN_API_LOGIN_MATCHER = /^\/api\/admin\/auth\/login($|\/)/;
const ADMIN_API_MATCHER = /^\/api\/admin($|\/)/;
const ADMIN_PAGE_MATCHER = /^\/admin($|\/)/;
const ADMIN_LOGIN_PAGE = '/admin/login';
const BIRTHDAY_PAGE_MATCHER = /^\/birthday($|\/)/;
const BIRTHDAY_API_MATCHER = /^\/api\/birthday($|\/)/;

async function ensureAdminSession(req: NextRequest, res: NextResponse): Promise<NextResponse> {
  const existing = req.cookies.get(ADMIN_COOKIE);
  if (existing && (await verify(existing.value, SECRET))) {
    return res;
  }

  const sessionId = crypto.randomUUID();
  const signed = await sign(sessionId, SECRET);
  res.cookies.set(ADMIN_COOKIE, signed, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SEC,
  });
  return res;
}

async function enforceAdminAuth(req: NextRequest): Promise<NextResponse | null> {
  const existing = req.cookies.get(ADMIN_COOKIE);
  if (existing && (await verify(existing.value, SECRET))) {
    return null;
  }
  return NextResponse.json(
    { ok: false, error: 'Unauthorized' },
    { status: 401 },
  );
}

async function redirectToAdminLogin(req: NextRequest): Promise<NextResponse> {
  const existing = req.cookies.get(ADMIN_COOKIE);
  if (existing && (await verify(existing.value, SECRET))) {
    return NextResponse.next();
  }
  const loginUrl = new URL(ADMIN_LOGIN_PAGE, req.url);
  loginUrl.searchParams.set('next', req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

async function ensureGuestSession(req: NextRequest, res: NextResponse): Promise<NextResponse> {
  const existing = req.cookies.get(GUEST_COOKIE);
  if (existing && existing.value.length > 0) {
    return res;
  }

  const sessionToken = crypto.randomUUID();
  res.cookies.set(GUEST_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  const isAdminApiLogin = ADMIN_API_LOGIN_MATCHER.test(pathname);
  if (isAdminApiLogin) {
    return res;
  }

  const isAdminApi = ADMIN_API_MATCHER.test(pathname);
  if (isAdminApi) {
    const blocked = await enforceAdminAuth(req);
    if (blocked) return blocked;
    return ensureAdminSession(req, res);
  }

  const isAdminPage = ADMIN_PAGE_MATCHER.test(pathname);
  if (isAdminPage) {
    const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';
    if (isLoginPage) {
      return NextResponse.next();
    }
    const redirect = await redirectToAdminLogin(req);
    return redirect;
  }

  const isBirthdayPage = BIRTHDAY_PAGE_MATCHER.test(pathname);
  const isBirthdayApi = BIRTHDAY_API_MATCHER.test(pathname);
  if (isBirthdayPage || isBirthdayApi) {
    return ensureGuestSession(req, res);
  }

  return res;
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/admin/:path*',
    '/birthday/:path*',
    '/api/birthday/:path*',
  ],
};
