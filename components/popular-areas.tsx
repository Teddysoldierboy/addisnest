'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { popularAreas, AREA_IMAGE_FALLBACK } from '@/lib/data';
import { listingsHref } from '@/lib/listings-filters';

function AreaCard({
  area,
}: {
  area: (typeof popularAreas)[number];
}) {
  const [imgSrc, setImgSrc] = useState<string>(area.image);
  const href = listingsHref({ location: area.searchTerm });

  return (
    <Link
      href={href}
      className="group relative rounded-2xl overflow-hidden block shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
    >
      <div className="aspect-[3/4] relative bg-stone-200">
        <Image
          src={imgSrc}
          alt={`${area.name}, Addis Ababa`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
          onError={() => setImgSrc(AREA_IMAGE_FALLBACK)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/95 via-[#0c0c0c]/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl font-semibold text-white mb-1 font-display">{area.name}</h3>
        <p className="text-white/80 text-sm mb-2 line-clamp-2">{area.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-white/90 text-sm font-medium">
            Explore {area.properties}+ listings
          </span>
          <ArrowRight className="h-5 w-5 text-[#C9A227] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export function PopularAreas() {
  return (
    <section id="areas" className="section-padding bg-stone-100/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-2">
            Neighborhoods
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0c0c0c] mb-4">
            Popular Areas in Addis Ababa
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            Discover sought-after districts — tap any area to browse verified listings in that
            neighborhood.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularAreas.map((area) => (
            <AreaCard key={area.name} area={area} />
          ))}
        </div>
      </div>
    </section>
  );
}
