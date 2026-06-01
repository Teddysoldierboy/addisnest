'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Heart, MapPin, Maximize2, Ruler } from 'lucide-react';
import type { Property } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';
import { AmenityBadges } from '@/components/property/AmenityBadges';
import { parseNumericPrice } from '@/lib/property-search';

interface PremiumPropertyCardProps {
  property: Property;
  onQuickView?: (property: Property) => void;
}

export function PremiumPropertyCard({ property, onQuickView }: PremiumPropertyCardProps) {
  const [saved, setSaved] = useState(false);
  const hero =
    property.featured_image ?? property.image_url ?? property.images?.[0] ?? null;
  const price = parseNumericPrice(property.price);
  const isRent = property.listing_type === 'rent';

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSaved((s) => !s);
    try {
      const key = 'addisnest_saved';
      const raw = localStorage.getItem(key);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const next = saved ? ids.filter((id) => id !== property.id) : [...ids, property.id];
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  return (
    <article className="group relative">
      <Link href={`/property/${property.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-stone-100 aspect-[4/3] shadow-md group-hover:shadow-2xl transition-all duration-500">
          {hero ? (
            <Image
              src={hero}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={hero.startsWith('http')}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-400">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={cn(
                'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md',
                isRent ? 'bg-blue-500/90 text-white' : 'bg-emerald-600/90 text-white'
              )}
            >
              {isRent ? 'For rent' : 'For sale'}
            </span>
            {property.is_featured && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C9A227] text-[#0c0c0c]">
                Featured
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={toggleSave}
              className={cn(
                'p-2 rounded-full backdrop-blur-md transition-colors',
                saved ? 'bg-[#C9A227] text-[#0c0c0c]' : 'bg-black/40 text-white hover:bg-black/60'
              )}
              aria-label="Save"
            >
              <Heart className={cn('w-4 h-4', saved && 'fill-current')} />
            </button>
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(property);
                }}
                className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md"
                aria-label="Quick view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-2xl font-bold text-white">
              {price > 0 ? formatPrice(price) : 'Price on request'}
              {isRent && <span className="text-sm font-normal text-white/70">/mo</span>}
            </p>
          </div>
        </div>

        <div className="pt-4 px-1">
          <h3 className="font-semibold text-[#0c0c0c] truncate group-hover:text-[#C9A227] transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-stone-500 text-sm">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          <AmenityBadges amenities={property.amenities} className="mt-2" limit={2} />
          <div className="flex items-center gap-4 mt-3 text-xs text-stone-500">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" /> {property.bedrooms} bd
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" /> {property.bathrooms} ba
              </span>
            )}
            {property.area != null && (
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5" /> {property.area} m²
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
