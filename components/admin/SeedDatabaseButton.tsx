'use client';

import { useState } from 'react';
import { Database, Loader2 } from 'lucide-react';

export function SeedDatabaseButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSeed() {
    if (!confirm('Insert 10 premium Addis Ababa sample listings into Supabase?')) return;
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/seed', { method: 'POST' });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error ?? 'Seed failed');
      return;
    }

    setMessage(data.message ?? 'Database seeded successfully.');
    window.location.reload();
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-amber-900">Premium seed data</p>
        <p className="text-xs text-amber-700/80 mt-0.5">
          Inject 10 hyper-realistic listings with live Unsplash imagery across Addis neighborhoods.
        </p>
        {message && <p className="text-xs mt-2 text-neutral-700">{message}</p>}
      </div>
      <button
        type="button"
        disabled={loading}
        onClick={handleSeed}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
        {loading ? 'Seeding…' : 'Seed 10 listings'}
      </button>
    </div>
  );
}
