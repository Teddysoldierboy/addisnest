import type { Property } from '@/lib/types';
import { parseNumericPrice } from '@/lib/property-search';

export interface CompareHighlights {
  lowestPriceId: string | null;
  bestPricePerSqmId: string | null;
  bestAffordabilityId: string | null;
}

export function pricePerSqm(property: Property): number | null {
  const price = parseNumericPrice(property.price);
  const area = property.area;
  if (!area || area <= 0 || price <= 0) return null;
  return price / area;
}

export function computeCompareHighlights(properties: Property[]): CompareHighlights {
  if (properties.length === 0) {
    return { lowestPriceId: null, bestPricePerSqmId: null, bestAffordabilityId: null };
  }

  let lowestPriceId: string | null = null;
  let lowestPrice = Infinity;

  let bestPpsId: string | null = null;
  let bestPps = Infinity;

  for (const p of properties) {
    const price = parseNumericPrice(p.price);
    if (price > 0 && price < lowestPrice) {
      lowestPrice = price;
      lowestPriceId = p.id;
    }

    const pps = pricePerSqm(p);
    if (pps != null && pps < bestPps) {
      bestPps = pps;
      bestPpsId = p.id;
    }
  }

  const bestAffordabilityId = bestPpsId ?? lowestPriceId;

  return {
    lowestPriceId,
    bestPricePerSqmId: bestPpsId,
    bestAffordabilityId,
  };
}
