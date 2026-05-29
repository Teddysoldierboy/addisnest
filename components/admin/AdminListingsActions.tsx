'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useCallback, useState } from 'react';

export function AdminListingsActions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const applyFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.push(`/admin/listings?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && applyFilter('search', search)}
          placeholder="Search by title or location..."
          className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>
      <select
        defaultValue={searchParams.get('status') ?? 'all'}
        onChange={e => applyFilter('status', e.target.value === 'all' ? '' : e.target.value)}
        className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
      >
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="hidden">Hidden</option>
        <option value="pending">Pending</option>
        <option value="sold">Sold</option>
        <option value="rented">Rented</option>
      </select>
    </div>
  );
}