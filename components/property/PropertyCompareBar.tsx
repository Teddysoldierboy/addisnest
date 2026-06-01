'use client';

import { CompareToggleButton } from '@/components/compare/CompareToggleButton';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import { useCompare } from '@/context/compare-context';

export function PropertyCompareBar({ propertyId }: { propertyId: string }) {
  const { count, hydrated } = useCompare();

  return (
    <div className="flex flex-wrap items-center gap-3 mt-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
      <CompareToggleButton propertyId={propertyId} variant="inline" />
      {hydrated && count > 0 && (
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C9A227] hover:underline"
        >
          <Scale className="w-4 h-4" />
          View comparison ({count})
        </Link>
      )}
    </div>
  );
}
