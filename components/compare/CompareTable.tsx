'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, ExternalLink, Trophy } from 'lucide-react';
import type { Property } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';
import { parseNumericPrice } from '@/lib/property-search';
import { computeCompareHighlights, pricePerSqm } from '@/lib/compare/analytics';
import type { CompareHighlights } from '@/lib/compare/analytics';

interface CompareTableProps {
  properties: Property[];
  highlights: CompareHighlights;
  onRemove: (id: string) => void;
}

type RowDef = {
  label: string;
  render: (p: Property) => React.ReactNode;
  highlight?: (p: Property, h: CompareHighlights) => boolean;
};

function formatDate(iso?: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-ET', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

function Cell({
  children,
  best,
}: {
  children: React.ReactNode;
  best?: boolean;
}) {
  return (
    <td
      className={cn(
        'px-4 py-3 text-sm text-stone-700 align-top min-w-[200px] border-l border-stone-100',
        best && 'bg-emerald-50/80 ring-1 ring-inset ring-emerald-200/60'
      )}
    >
      {best && (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
          <Trophy className="w-3 h-3" /> Best
        </span>
      )}
      {children}
    </td>
  );
}

export function CompareTable({ properties, highlights, onRemove }: CompareTableProps) {
  const rows: RowDef[] = [
    {
      label: 'Price',
      render: (p) => {
        const price = parseNumericPrice(p.price);
        const rent = p.listing_type === 'rent';
        return (
          <span className="font-bold text-[#0c0c0c]">
            {price > 0 ? formatPrice(price) : '—'}
            {rent && <span className="text-stone-500 font-normal">/mo</span>}
          </span>
        );
      },
      highlight: (p, h) => p.id === h.lowestPriceId,
    },
    {
      label: 'Location',
      render: (p) => p.location || '—',
    },
    {
      label: 'Bedrooms',
      render: (p) => (p.bedrooms != null ? p.bedrooms : '—'),
    },
    {
      label: 'Bathrooms',
      render: (p) => (p.bathrooms != null ? p.bathrooms : '—'),
    },
    {
      label: 'Area (m²)',
      render: (p) => (p.area != null ? `${p.area} m²` : '—'),
    },
    {
      label: 'Property type',
      render: (p) => <span className="capitalize">{p.category || '—'}</span>,
    },
    {
      label: 'Listing type',
      render: (p) => (
        <span className="capitalize">
          {p.listing_type === 'rent' ? 'For rent' : p.listing_type === 'buy' ? 'For sale' : p.listing_type}
        </span>
      ),
    },
    {
      label: 'Amenities',
      render: (p) =>
        p.amenities?.length ? (
          <ul className="space-y-1">
            {p.amenities.map((a) => (
              <li key={a} className="text-xs text-stone-600">
                • {a}
              </li>
            ))}
          </ul>
        ) : (
          '—'
        ),
    },
    {
      label: 'Verification',
      render: (p) => (
        <span
          className={cn(
            'inline-flex text-xs font-semibold px-2 py-0.5 rounded-full',
            p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
          )}
        >
          {p.status === 'active' ? 'Verified active' : p.status}
        </span>
      ),
    },
    {
      label: 'Added',
      render: (p) => formatDate(p.created_at),
    },
    {
      label: 'Price per m²',
      render: (p) => {
        const pps = pricePerSqm(p);
        return pps != null ? formatPrice(Math.round(pps)) : '—';
      },
      highlight: (p, h) => p.id === h.bestPricePerSqmId,
    },
    {
      label: 'Affordability score',
      render: (p) => {
        const pps = pricePerSqm(p);
        const price = parseNumericPrice(p.price);
        if (pps != null) return `${formatPrice(Math.round(pps))} / m²`;
        if (price > 0) return formatPrice(price);
        return '—';
      },
      highlight: (p, h) => p.id === h.bestAffordabilityId,
    },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm animate-in fade-in duration-500">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-stone-50 border-b border-stone-200">
            <th className="sticky left-0 z-20 bg-stone-50 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-stone-500 w-40 min-w-[140px]">
              Metric
            </th>
            {properties.map((p) => {
              const hero = p.featured_image ?? p.image_url ?? p.images?.[0];
              return (
                <th
                  key={p.id}
                  className="px-4 py-4 text-left border-l border-stone-200 min-w-[220px] align-top"
                >
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => onRemove(p.id)}
                      className="absolute -top-1 -right-1 z-10 p-1.5 rounded-full bg-white border border-stone-200 shadow hover:bg-red-50 hover:text-red-600 transition-colors"
                      aria-label="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-3">
                      {hero ? (
                        <Image
                          src={hero}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="220px"
                          unoptimized={hero.startsWith('http')}
                        />
                      ) : null}
                    </div>
                    <h3 className="font-semibold text-[#0c0c0c] text-sm line-clamp-2 pr-6">{p.title}</h3>
                    <Link
                      href={`/property/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs text-[#C9A227] font-medium mt-2 hover:underline"
                    >
                      View listing <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
              <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-xs font-semibold text-stone-500 border-r border-stone-100">
                {row.label}
              </th>
              {properties.map((p) => (
                <Cell key={p.id} best={row.highlight?.(p, highlights)}>
                  {row.render(p)}
                </Cell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
