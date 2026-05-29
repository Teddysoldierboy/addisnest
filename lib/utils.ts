export function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `ETB ${(price / 1_000_000).toFixed(1)}M`;
  }
  if (price >= 1_000) {
    return `ETB ${(price / 1_000).toFixed(0)}K`;
  }
  return `ETB ${price.toLocaleString()}`;
}