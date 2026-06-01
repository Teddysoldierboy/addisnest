'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) setError('Invalid email or password.');
    else router.replace('/admin/dashboard');
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-[#0c0c0c]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A227] text-[#0c0c0c] font-bold">
              AN
            </span>
            <span className="font-display text-2xl text-white">AddisNest</span>
          </Link>
          <h1 className="text-xl font-semibold text-white">Admin console</h1>
          <p className="text-stone-400 text-sm mt-1">Secure access for listing managers</p>
        </div>
        <form onSubmit={handleLogin} className="glass-panel rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
            />
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0c0c0c] hover:bg-[#1a1a1a] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in to dashboard'}
          </button>
        </form>
      </div>
    </main>
  );
}
