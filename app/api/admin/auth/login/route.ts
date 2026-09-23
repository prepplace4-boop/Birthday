import { NextRequest, NextResponse } from 'next/server';
import { AdminLoginSchema } from '@/lib/api/validators';
import { ADMIN_SESSION_TTL_SEC, sign, SECRET } from '@/lib/api/session';

export const dynamic = 'force-dynamic';

const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = 'change-me-123';

function getAdminCredentials(): { email: string; password: string } {
  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;
  const usingDefaults = !envEmail || !envPassword;

  if (usingDefaults) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[ADMIN AUTH] WARNING: ADMIN_EMAIL / ADMIN_PASSWORD env vars are not set in production! Using hardcoded dev defaults - this is unsafe.',
      );
    } else {
      console.warn(
        '[ADMIN AUTH] Dev default credentials in use: email=admin@example.com password=change-me-123. Set ADMIN_EMAIL / ADMIN_PASSWORD env vars to override.',
      );
    }
  }

  return {
    email: envEmail ?? DEFAULT_ADMIN_EMAIL,
    password: envPassword ?? DEFAULT_ADMIN_PASSWORD,
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const parsed = AdminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid credentials format',
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;
  const credentials = getAdminCredentials();

  const emailOk = email.toLowerCase() === credentials.email.toLowerCase();
  const passwordOk = password === credentials.password;

  if (!emailOk || !passwordOk) {
    return NextResponse.json(
      { ok: false, error: 'Invalid email or password' },
      { status: 401 },
    );
  }

  const sessionId = crypto.randomUUID();
  const signed = await sign(sessionId, SECRET);

  const response = NextResponse.json(
    {
      ok: true,
      admin: {
        email: credentials.email,
      },
    },
    { status: 200 },
  );

  response.cookies.set('admin_session', signed, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SEC,
  });

  return response;
}
