'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Property } from '@/lib/types';
import { filterAndSortListings, parseNumericPrice } from '@/lib/property-search';
import { PremiumHero } from '@/components/home/PremiumHero';
import { PremiumPropertyCard } from '@/components/marketplace/PremiumPropertyCard';
import { PopularAreas } from '@/components/popular-areas';
import { WhyChooseUs } from '@/components/why-choose-us';
import { VerifiedListings } from '@/components/verified-listings';
import { CompareProjects } from '@/components/compare-projects';
import { toMapListings } from '@/components/map/AddisListingsMap';
import { LayoutGrid, Map, ChevronDown } from 'lucide-react';

const AddisListingsMap = dynamic(
  () => import('@/components/map/AddisListingsMap').then((m) => m.AddisListingsMap),
  { ssr: false, loading: () => <div className="h-[420px] rounded-2xl bg-stone-200 animate-pulse" /> }
);

const PAGE_SIZE = 9;

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

export function HomePage() {
  const [listings, setListings] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [mode, setMode] = useState<'buy' | 'rent'>('buy');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortPrice, setSortPrice] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(e instanceof Error ? e.message : 'Connection failed');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    let result = filterAndSortListings(listings, search, 'all', sortPrice);

    result = result.filter((p) => {
      const lt = (p.listing_type || '').toLowerCase();
      if (mode === 'rent') return lt === 'rent';
      return lt === 'buy' || lt === 'sale';
    });
    if (propertyType !== 'all') {
      result = result.filter((p) => p.category?.toLowerCase() === propertyType);
    }
    if (minPrice) {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) result = result.filter((p) => parseNumericPrice(p.price) >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) result = result.filter((p) => parseNumericPrice(p.price) <= max);
    }

    setFiltered(result);
    setVisibleCount(PAGE_SIZE);
  }, [listings, search, typeFilter, sortPrice, mode, propertyType, minPrice, maxPrice]);

  const featured = useMemo(
    () => filtered.filter((p) => p.is_featured).slice(0, 6),
    [filtered]
  );
  const visible = filtered.slice(0, visibleCount);
  const mapListings = toMapListings(filtered);

  function scrollToListings() {
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <PremiumHero
        mode={mode}
        onModeChange={setMode}
        search={search}
        onSearchChange={setSearch}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        propertyType={propertyType}
        onPropertyTypeChange={setPropertyType}
        onSearchSubmit={scrollToListings}
      />

      {featured.length > 0 && (
        <section id="featured" className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-2">Curated</p>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#0c0c0c]">
                  Featured properties
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((p) => (
                <PremiumPropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div id="areas">
        <PopularAreas />
      </div>

      <WhyChooseUs />

      <div id="verified">
        <VerifiedListings />
      </div>

      <div id="projects">
        <CompareProjects />
      </div>

      <section id="listings" className="section-padding bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-2">Marketplace</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#0c0c0c]">
                {loading ? 'Loading…' : `${filtered.length} properties`}
              </h2>
              <p className="text-stone-500 mt-2">Live listings across Addis Ababa · ETB pricing</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sortPrice}
                onChange={(e) => setSortPrice(e.target.value)}
                className="py-2.5 px-4 rounded-xl border border-stone-200 bg-white text-sm"
              >
                <option value="default">Sort: Newest</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
              </select>
              <div className="flex rounded-xl border border-stone-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#0c0c0c] text-white' : ''}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-[#0c0c0c] text-white' : ''}`}
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
          )}

          {viewMode === 'map' ? (
            <AddisListingsMap listings={mapListings} className="rounded-2xl overflow-hidden shadow-xl" />
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-stone-200 animate-pulse" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-stone-300 bg-white">
              <p className="font-semibold text-stone-800">No properties match your search</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setMinPrice('');
                  setMaxPrice('');
                  setPropertyType('all');
                }}
                className="mt-4 text-sm font-semibold text-[#C9A227]"
              >
                Reset filters
              </button>
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
      </section>

      <section id="trust" className="section-padding bg-[#0c0c0c] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-4">Trust</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">
            Built for Ethiopian buyers & diaspora investors
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto mb-10">
            Verified agents, transparent ETB pricing, neighborhood intelligence, and secure tour scheduling.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Verified listings', value: '100%' },
              { label: 'Neighborhoods', value: '12+' },
              { label: 'Agent partners', value: '50+' },
              { label: 'Avg. response', value: '< 2h' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-[#C9A227]">{s.value}</p>
                <p className="text-sm text-stone-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
