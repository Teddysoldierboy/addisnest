'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Property } from '@/lib/types';
import { applyListingsFilters } from '@/lib/listings-filters';
import { PremiumPropertyCard } from '@/components/marketplace/PremiumPropertyCard';
import { ChevronDown, ArrowLeft, ShieldCheck } from 'lucide-react';

const PAGE_SIZE = 12;

function normalizeRow(raw: Record<string, unknown>): Property {
  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? (raw.images as string[])
      : raw.image_url
        ? [String(raw.image_url)]
        : [];
  return {
    ...(raw as unknown as Property),
    images,
    amenities: Array.isArray(raw.amenities) ? (raw.amenities as string[]) : [],
    featured_image: (raw.featured_image as string) ?? images[0] ?? null,
    latitude: raw.latitude != null ? Number(raw.latitude) : null,
    longitude: raw.longitude != null ? Number(raw.longitude) : null,
  };
}

export function ListingsPageContent() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location') ?? '';
  const verified = searchParams.get('verified') === '1';
  const initialSearch = searchParams.get('search') ?? '';
  const modeParam = searchParams.get('mode');

  const [listings, setListings] = useState<Property[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [sortPrice, setSortPrice] = useState('default');
  const [mode, setMode] = useState<'buy' | 'rent' | 'all'>(
    modeParam === 'rent' ? 'rent' : modeParam === 'buy' ? 'buy' : 'all'
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSearch(initialSearch);
    if (modeParam === 'rent' || modeParam === 'buy') {
      setMode(modeParam);
    }
  }, [initialSearch, modeParam]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: qErr } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (qErr) {
        const fb = await supabase.from('listings').select('*');
        if (fb.error) throw fb.error;
        setListings((fb.data ?? []).map((r) => normalizeRow(r as Record<string, unknown>)));
      } else {
        setListings((data ?? []).map((r) => normalizeRow(r as Record<string, unknown>)));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load listings');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchListings();
  }, [fetchListings]);

  const filtered = useMemo(
    () =>
      applyListingsFilters(listings, {
        search,
        location,
        verified,
        mode,
        sortPrice,
      }),
    [listings, search, location, verified, mode, sortPrice]
  );

  const visible = filtered.slice(0, visibleCount);

  const pageTitle = verified
    ? 'Verified listings'
    : location
      ? `Properties in ${location}`
      : 'All properties';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-[#0c0c0c] mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <div className="mb-10">
        {verified && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified active listings
          </span>
        )}
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-[#0c0c0c]">{pageTitle}</h1>
        <p className="text-stone-500 mt-2">
          {loading ? 'Loading…' : `${filtered.length} properties found`}
          {location ? ` · filtered by “${location}”` : ''}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-2xl bg-white border border-stone-200">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search keywords…"
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
        />
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'buy' | 'rent' | 'all')}
          className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white"
        >
          <option value="all">All types</option>
          <option value="buy">For sale</option>
          <option value="rent">For rent</option>
        </select>
        <select
          value={sortPrice}
          onChange={(e) => setSortPrice(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white"
        >
          <option value="default">Sort: Default</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-stone-300 bg-white">
          <p className="font-semibold text-stone-800">
            {verified ? 'No verified listings match this filter' : 'No listings match this filter'}
          </p>
          <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
            {verified
              ? 'Verified listings need an active status, photo, and agent contact on file.'
              : 'Try adjusting your search or filters.'}
          </p>
          <Link href="/listings" className="text-sm text-[#C9A227] font-medium mt-3 inline-block">
            {verified ? 'View all properties' : 'Clear filters'}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((p) => (
              <PremiumPropertyCard key={p.id} property={p} />
            ))}
          </div>
          {visibleCount < filtered.length && (
            <div className="text-center mt-12">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#0c0c0c] text-sm font-semibold hover:bg-[#0c0c0c] hover:text-white transition-colors"
              >
                Load more
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
