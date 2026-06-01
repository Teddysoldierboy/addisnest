import type { Property } from '@/lib/types';
import { filterAndSortListings, matchesPropertySearch, parseNumericPrice } from '@/lib/property-search';

export interface ListingsFilterParams {
  search?: string;
  location?: string;
  verified?: boolean;
  mode?: 'buy' | 'rent' | 'all';
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sortPrice?: string;
}

export function applyListingsFilters(
  listings: Property[],
  params: ListingsFilterParams
): Property[] {
  let result = filterAndSortListings(
    listings,
    params.search?.trim() ?? '',
    'all',
    params.sortPrice ?? 'default'
  );

  if (params.mode && params.mode !== 'all') {
    result = result.filter((p) => {
      const lt = (p.listing_type || '').toLowerCase();
      if (params.mode === 'rent') return lt === 'rent';
      return lt === 'buy' || lt === 'sale';
    });
  }

  const category = params.category;
  if (category && category !== 'all') {
    const cat = category.toLowerCase();
    result = result.filter((p) => p.category?.toLowerCase() === cat);
  }

  if (params.minPrice) {
    const min = Number(params.minPrice);
    if (!Number.isNaN(min)) {
      result = result.filter((p) => parseNumericPrice(p.price) >= min);
    }
  }

  if (params.maxPrice) {
    const max = Number(params.maxPrice);
    if (!Number.isNaN(max)) {
      result = result.filter((p) => parseNumericPrice(p.price) <= max);
    }
  }

  if (params.verified) {
    result = result.filter((p) => p.status === 'active');
  }

  if (params.location?.trim()) {
    const loc = params.location.trim();
    result = result.filter((p) => matchesPropertySearch(p, loc));
  }

  return result;
}

export function listingsHref(options: {
  location?: string;
  verified?: boolean;
  search?: string;
  mode?: 'buy' | 'rent';
}): string {
  const q = new URLSearchParams();
  if (options.location) q.set('location', options.location);
  if (options.verified) q.set('verified', '1');
  if (options.search) q.set('search', options.search);
  if (options.mode) q.set('mode', options.mode);
  const s = q.toString();
  return s ? `/listings?${s}` : '/listings';
}
