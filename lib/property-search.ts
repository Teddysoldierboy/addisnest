import type { Property } from '@/lib/types';

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Case-insensitive regex match across searchable property text fields. */
export function matchesPropertySearch(
  listing: Pick<Property, 'title' | 'location' | 'description' | 'category'>,
  rawQuery: string
): boolean {
  const query = rawQuery.toLowerCase().trim();
  if (!query) return true;

  const pattern = new RegExp(escapeRegExp(query), 'i');
  const haystack = [
    listing.title ?? '',
    listing.location ?? '',
    listing.description ?? '',
    listing.category ?? '',
  ].join(' ');

  return pattern.test(haystack);
}

export function parseNumericPrice(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const cleaned = String(value).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function normalizeListingType(value: string | null | undefined): string {
  const v = (value ?? '').toLowerCase().trim();
  if (v === 'sale') return 'buy';
  return v;
}

export function filterAndSortListings<T extends Property>(
  listings: T[],
  search: string,
  typeFilter: string,
  sortPrice: string
): T[] {
  let result = [...listings];

  if (search.trim()) {
    result = result.filter((listing) => matchesPropertySearch(listing, search));
  }

  if (typeFilter !== 'all') {
    const target = normalizeListingType(typeFilter);
    result = result.filter((listing) => normalizeListingType(listing.listing_type) === target);
  }

  if (sortPrice === 'low') {
    result.sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price));
  } else if (sortPrice === 'high') {
    result.sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price));
  }

  return result;
}
