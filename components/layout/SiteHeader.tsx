'use client';

import Link from 'next/link';
import { Menu, X, Scale } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCompare } from '@/context/compare-context';
import { toAppPath } from '@/lib/routes';

const nav = [
  { href: '/listings', label: 'Browse' },
  { href: '/#areas', label: 'Neighborhoods' },
  { href: '/#featured', label: 'Featured' },
  { href: '/compare', label: 'Compare' },
  { href: '/admin/dashboard', label: 'Admin' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count, hydrated } = useCompare();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[4.25rem] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0c0c0c] text-[#C9A227] font-bold text-sm">
            AN
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-[#0c0c0c]">
            Addis<span className="text-[#C9A227]">Nest</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={toAppPath(item.href)}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-[#0c0c0c] rounded-lg hover:bg-stone-100 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/compare"
            className="relative inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-[#0c0c0c] px-3 py-2"
          >
            <Scale className="w-4 h-4" />
            Compare
            {hydrated && count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#C9A227] text-[#0c0c0c] text-[10px] font-bold px-1">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/admin/login"
            className="text-sm font-medium text-stone-600 hover:text-[#0c0c0c] px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/admin/listings/new"
            className="text-sm font-semibold px-5 py-2.5 rounded-full bg-[#0c0c0c] text-white hover:bg-[#1a1a1a] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5"
          >
            List property
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-stone-100"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div
        className={cn(
          'md:hidden border-t border-stone-100 bg-white overflow-hidden transition-all',
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="flex flex-col p-4 gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={toAppPath(item.href)}
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-stone-50"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/listings/new"
            onClick={() => setOpen(false)}
            className="mt-2 text-center text-sm font-semibold px-4 py-3 rounded-full bg-[#0c0c0c] text-white"
          >
            List property
          </Link>
        </nav>
      </div>
    </header>
  );
}
