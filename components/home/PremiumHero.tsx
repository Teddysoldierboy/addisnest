'use client';

import Image from 'next/image';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';

interface PremiumHeroProps {
  mode: 'buy' | 'rent';
  onModeChange: (mode: 'buy' | 'rent') => void;
  search: string;
  onSearchChange: (v: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (v: string) => void;
  onMaxPriceChange: (v: string) => void;
  propertyType: string;
  onPropertyTypeChange: (v: string) => void;
  onSearchSubmit: () => void;
}

export function PremiumHero({
  mode,
  onModeChange,
  search,
  onSearchChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  propertyType,
  onPropertyTypeChange,
  onSearchSubmit,
}: PremiumHeroProps) {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
        alt="Luxury Addis Ababa skyline"
        fill
        priority
        className="object-cover"
        sizes="100vw"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/95 via-[#0c0c0c]/75 to-[#0c0c0c]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/80 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-6">
            <span className="h-px w-8 bg-[#C9A227]" />
            Ethiopia&apos;s premium proptech
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white leading-[1.05] mb-6">
            Discover exceptional homes in{' '}
            <span className="text-gradient-gold">Addis Ababa</span>
          </h1>
          <p className="text-lg text-stone-300 max-w-xl mb-10 leading-relaxed">
            Curated apartments, villas, and commercial spaces with verified agents, live maps, and
            transparent ETB pricing.
          </p>

          <div className="inline-flex p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            {(['buy', 'rent'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onModeChange(m)}
                className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  mode === m
                    ? 'bg-[#C9A227] text-[#0c0c0c] shadow-lg'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {m === 'buy' ? 'Buy' : 'Rent'}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 md:p-5 max-w-4xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Neighborhood, landmark, keyword…"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
              />
            </div>
            <select
              value={propertyType}
              onChange={(e) => onPropertyTypeChange(e.target.value)}
              className="md:col-span-2 py-3.5 px-3 rounded-xl border border-stone-200 bg-white text-sm"
            >
              <option value="all">All types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="commercial">Commercial</option>
            </select>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              placeholder="Min ETB"
              className="md:col-span-2 py-3.5 px-3 rounded-xl border border-stone-200 bg-white text-sm"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              placeholder="Max ETB"
              className="md:col-span-2 py-3.5 px-3 rounded-xl border border-stone-200 bg-white text-sm"
            />
            <button
              type="button"
              onClick={onSearchSubmit}
              className="md:col-span-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0c0c0c] text-white font-semibold text-sm hover:bg-[#1a1a1a] transition-colors"
            >
              <Search className="w-4 h-4 md:hidden" />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>
          <p className="mt-3 text-xs text-stone-500 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Advanced filters available in listings below
          </p>
        </div>
      </div>
    </section>
  );
}
