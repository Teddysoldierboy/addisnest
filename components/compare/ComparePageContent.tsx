'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Scale, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCompare } from '@/context/compare-context';
import { CompareTable } from '@/components/compare/CompareTable';
import { computeCompareHighlights } from '@/lib/compare/analytics';
import { normalizePropertyRow } from '@/lib/compare/normalize';
import type { Property } from '@/lib/types';
import { MAX_COMPARE_PROPERTIES } from '@/lib/compare/constants';

export function ComparePageContent() {
  const { ids, count, clear, remove, syncValidIds, hydrated } = useCompare();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    if (ids.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: qErr } = await supabase
        .from('properties')
        .select('*')
        .in('id', ids);

      if (qErr) throw qErr;

      const map = new Map(
        (data ?? []).map((row) => [String(row.id), normalizePropertyRow(row as Record<string, unknown>)])
      );
      const ordered = ids.map((id) => map.get(id)).filter((p): p is Property => Boolean(p));

      syncValidIds([...map.keys()]);

      setProperties(ordered);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [ids, syncValidIds]);

  useEffect(() => {
    if (!hydrated) return;
    void fetchProperties();
  }, [hydrated, fetchProperties]);

  const highlights = useMemo(() => computeCompareHighlights(properties), [properties]);

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500">Loading comparison…</div>
    );
  }

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-2xl bg-[#C9A227]/10 flex items-center justify-center mx-auto mb-6">
          <Scale className="w-8 h-8 text-[#C9A227]" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-[#0c0c0c] mb-3">No properties selected</h1>
        <p className="text-stone-500 mb-8">
          Select properties to compare first. Use the <strong>Compare</strong> button on any listing card
          (up to {MAX_COMPARE_PROPERTIES} properties).
        </p>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 bg-[#0c0c0c] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1a1a1a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Browse listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-[#0c0c0c] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to marketplace
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-2">Compare</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-[#0c0c0c]">
            Side-by-side comparison
          </h1>
          <p className="text-stone-500 mt-2">
            Comparing {properties.length} of {count} selected · ETB market analytics
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
          {count < MAX_COMPARE_PROPERTIES && (
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A227] text-[#0c0c0c] text-sm font-semibold hover:bg-[#E8D48B] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add more properties
            </Link>
          )}
        </div>
      </div>

      {properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: 'Lowest price',
              id: highlights.lowestPriceId,
              desc: 'Best outright price in this set',
            },
            {
              label: 'Best value / m²',
              id: highlights.bestPricePerSqmId,
              desc: 'Lowest price per square meter',
            },
            {
              label: 'Best affordability',
              id: highlights.bestAffordabilityId,
              desc: 'Strongest overall value signal',
            },
          ].map((card) => {
            const p = properties.find((x) => x.id === card.id);
            return (
              <div
                key={card.label}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm animate-in slide-in-from-bottom-2 duration-300"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#C9A227]">{card.label}</p>
                <p className="font-semibold text-[#0c0c0c] mt-1 line-clamp-1">{p?.title ?? '—'}</p>
                <p className="text-xs text-stone-500 mt-1">{card.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <CompareTable properties={properties} highlights={highlights} onRemove={remove} />
      ) : (
        <p className="text-center text-stone-500 py-12">Selected listings could not be loaded.</p>
      )}
    </div>
  );
}
