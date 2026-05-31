import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Ruler } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const heroImage = property.featured_image ?? property.images[0] ?? '/images/placeholder.jpg';

  return (
    <Link href={`/property/${property.id}`} className={cn('group block', className)}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <Image
            src={heroImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm',
              property.listing_type === 'rent'
                ? 'bg-blue-500/90 text-white'
                : 'bg-emerald-500/90 text-white'
            )}>
              For {property.listing_type === 'rent' ? 'Rent' : 'Sale'}
            </span>
            {property.is_featured && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/90 text-white backdrop-blur-sm">
                Featured
              </span>
            )}
          </div>
          {/* Image count */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
              +{property.images.length - 1} photos
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xl font-bold text-neutral-900">
            {formatPrice(property.price)}
            {property.listing_type === 'rent' && <span className="text-sm font-normal text-neutral-500">/mo</span>}
          </p>
          <h3 className="font-semibold text-neutral-800 mt-1 truncate">{property.title}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
            <p className="text-sm text-neutral-500 truncate">{property.location}</p>
          </div>

          {/* Specs */}
          {(property.bedrooms || property.bathrooms || property.area) && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-100 text-neutral-500">
              {property.bedrooms != null && (
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5" />
                  <span className="text-xs">{property.bedrooms} bd</span>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" />
                  <span className="text-xs">{property.bathrooms} ba</span>
                </div>
              )}
              {property.area != null && (
                <div className="flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" />
                  <span className="text-xs">{property.area} m²</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}