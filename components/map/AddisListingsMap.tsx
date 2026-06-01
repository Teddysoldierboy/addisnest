'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import Link from 'next/link';
import type { Property } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

const ADDIS_CENTER: [number, number] = [9.0054, 38.7636];

export interface MapListing {
  id: string;
  title: string;
  price: number;
  listing_type: string;
  location: string;
  latitude: number;
  longitude: number;
}

interface AddisListingsMapProps {
  listings: MapListing[];
  className?: string;
  height?: string;
}

export function AddisListingsMap({ listings, className, height = '420px' }: AddisListingsMapProps) {
  const points = useMemo(
    () =>
      listings.filter(
        (l) =>
          Number.isFinite(l.latitude) &&
          Number.isFinite(l.longitude) &&
          l.latitude !== 0 &&
          l.longitude !== 0
      ),
    [listings]
  );

  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={points[0] ? [points[0].latitude, points[0].longitude] : ADDIS_CENTER}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full rounded-2xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.latitude, p.longitude]}
            radius={10}
            pathOptions={{
              color: p.listing_type === 'rent' ? '#3b82f6' : '#10b981',
              fillColor: p.listing_type === 'rent' ? '#3b82f6' : '#10b981',
              fillOpacity: 0.75,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-[160px]">
                <p className="font-semibold text-sm text-neutral-900">{p.title}</p>
                <p className="text-xs text-neutral-500">{p.location}</p>
                <p className="text-sm font-bold text-amber-600 mt-1">{formatPrice(p.price)}</p>
                <Link href={`/property/${p.id}`} className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                  View details →
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      {points.length === 0 && (
        <p className="text-center text-sm text-neutral-500 mt-2">
          No geocoded listings yet. Seed data includes Addis coordinates.
        </p>
      )}
    </div>
  );
}

export function toMapListings(properties: Property[]): MapListing[] {
  return properties
    .filter((p) => p.latitude != null && p.longitude != null)
    .map((p) => ({
      id: p.id,
      title: p.title,
      price: Number(p.price) || 0,
      listing_type: String(p.listing_type),
      location: p.location,
      latitude: Number(p.latitude),
      longitude: Number(p.longitude),
    }));
}
