import type { Property } from '@/lib/types';

export function normalizePropertyRow(raw: Record<string, unknown>): Property {
  const images: string[] =
    Array.isArray(raw.images) && raw.images.length > 0
      ? (raw.images as string[])
      : raw.image_url
        ? [String(raw.image_url)]
        : [];

  const amenities = Array.isArray(raw.amenities)
    ? (raw.amenities as string[])
    : typeof raw.amenities === 'string'
      ? raw.amenities.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

  return {
    ...(raw as unknown as Property),
    images,
    amenities,
    featured_image: (raw.featured_image as string) ?? images[0] ?? null,
    latitude: raw.latitude != null ? Number(raw.latitude) : null,
    longitude: raw.longitude != null ? Number(raw.longitude) : null,
  };
}
