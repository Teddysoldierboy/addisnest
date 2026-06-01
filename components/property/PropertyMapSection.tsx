'use client';

import dynamic from 'next/dynamic';
import { toMapListings, type MapListing } from '@/components/map/AddisListingsMap';
import type { Property } from '@/lib/types';

const AddisListingsMap = dynamic(
  () => import('@/components/map/AddisListingsMap').then((m) => m.AddisListingsMap),
  {
    ssr: false,
    loading: () => <div className="h-64 rounded-2xl bg-neutral-100 animate-pulse" />,
  }
);

interface PropertyMapSectionProps {
  property: Property;
}

export function PropertyMapSection({ property }: PropertyMapSectionProps) {
  const points: MapListing[] = toMapListings([property]);
  if (!points.length) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100">
      <h2 className="font-semibold text-neutral-900 mb-3">Location in Addis Ababa</h2>
      <AddisListingsMap listings={points} height="280px" />
    </div>
  );
}
