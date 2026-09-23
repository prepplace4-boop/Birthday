'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

async function fetchJson(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data && typeof data === 'object' && 'error' in data ? String((data as { error?: string }).error) : 'Login failed'));
  }

  return data;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [nextTarget, setNextTarget] = useState('/admin');
  const [credentials, setCredentials] = useState({
    email: 'admin@example.com',
    password: 'change-me-123',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextTarget(params.get('next') || '/admin');
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('Signing in...');

    try {
      await fetchJson('/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      router.push(nextTarget);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fdf3ea_0%,_#f3e6d6_32%,_#e7d8b9_100%)] px-4 py-10 text-stone-800">
      <div className="w-full max-w-md rounded-[30px] border border-stone-200 bg-white/80 p-6 shadow-[0_25px_60px_rgba(91,62,43,0.10)] backdrop-blur-sm sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-rose-500">admin</p>
        <h1 className="mt-3 font-display text-4xl text-stone-800">Birthday Studio</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Sign in to unlock days, edit copy, and manage the birthday journey.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
            <input
              value={credentials.email}
              onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-rose-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-rose-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-stone-600">{message}</p> : null}
      </div>
    </main>
  );
}
