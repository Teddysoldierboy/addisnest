'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Scale, X } from 'lucide-react';
import { useCompare } from '@/context/compare-context';
import { cn } from '@/lib/utils';

export function CompareFloatingBar() {
  const pathname = usePathname();
  const { count, clear, hydrated } = useCompare();

  if (!hydrated || count === 0 || pathname === '/compare') return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'animate-in slide-in-from-bottom-4 fade-in duration-300'
      )}
    >
      <div className="flex items-center gap-3 pl-5 pr-2 py-2.5 rounded-full bg-[#0c0c0c] text-white shadow-2xl border border-[#C9A227]/30">
        <Scale className="w-4 h-4 text-[#C9A227]" />
        <span className="text-sm font-medium">
          {count} {count === 1 ? 'property' : 'properties'} selected
        </span>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 bg-[#C9A227] text-[#0c0c0c] font-semibold text-sm px-4 py-2 rounded-full hover:bg-[#E8D48B] transition-colors"
        >
          Compare now
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={clear}
          className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
          aria-label="Clear comparison"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
