'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, ArrowRight, Check, MapPin, Bed, Bath } from 'lucide-react';
import { toast } from 'sonner';
import { useCompare } from '@/context/compare-context';

export function CompareProjects() {
  const router = useRouter();
  const { count, ids, hydrated } = useCompare();

  function handleStartComparing() {
    if (!hydrated) return;
    if (count === 0) {
      toast.message('Select properties to compare first', {
        description: 'Tap Compare on any listing card, then return here.',
      });
      return;
    }
    router.push('/compare');
  }

  return (
    <section id="projects" className="py-20 bg-stone-100/80 border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] rounded-2xl bg-white border border-stone-200/60 p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-full aspect-video bg-[#0c0c0c] rounded-xl mb-3 flex items-center justify-center">
                    <span className="text-[10px] text-[#C9A227] font-mono tracking-widest uppercase">Bole</span>
                  </div>
                  <h4 className="font-bold text-[#0c0c0c] text-sm truncate">Premium 3-BR Apartment</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span className="text-xs text-stone-500 truncate">Bole Atlas</span>
                  </div>
                  <div className="flex gap-2 mt-3 text-[11px] text-stone-500">
                    <span className="flex items-center gap-0.5">
                      <Bed className="w-3 h-3" /> 3 bd
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Bath className="w-3 h-3" /> 2 ba
                    </span>
                  </div>
                </div>
                <div className="h-8 w-full bg-[#C9A227]/15 text-[#0c0c0c] font-medium text-xs rounded-xl flex items-center justify-center mt-2">
                  {hydrated && count > 0 ? 'In your compare list' : 'Ready to compare'}
                </div>
              </div>

              <div className="aspect-[4/5] rounded-2xl bg-white border border-stone-200/60 p-4 flex flex-col justify-between shadow-sm mt-8">
                <div>
                  <div className="w-full aspect-video bg-stone-800 rounded-xl mb-3 flex items-center justify-center">
                    <span className="text-[10px] text-stone-400 font-mono tracking-widest uppercase">CMC</span>
                  </div>
                  <h4 className="font-bold text-[#0c0c0c] text-sm truncate">Family Villa</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span className="text-xs text-stone-500 truncate">CMC</span>
                  </div>
                  <div className="flex gap-2 mt-3 text-[11px] text-stone-500">
                    <span className="flex items-center gap-0.5">
                      <Bed className="w-3 h-3" /> 4 bd
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Bath className="w-3 h-3" /> 3 ba
                    </span>
                  </div>
                </div>
                <div className="h-8 w-full bg-[#C9A227]/15 text-[#0c0c0c] font-medium text-xs rounded-xl flex items-center justify-center mt-2">
                  Up to 4 listings
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="w-14 h-14 rounded-2xl bg-[#C9A227]/10 flex items-center justify-center mb-6">
              <Scale className="h-6 w-6 text-[#C9A227]" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0c0c0c] mb-4 tracking-tight">
              Compare Properties Side by Side
            </h2>
            <p className="text-stone-500 text-base mb-6 leading-relaxed">
              Make informed decisions by comparing multiple properties simultaneously. View prices, features,
              amenities, and locations in one premium grid with ETB value analytics.
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {[
                'Compare up to 4 premium properties at once',
                'Side-by-side spec metric comparison breakdown',
                'Value analytics relative to local market neighborhoods',
                'Selections saved automatically in your browser',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-stone-700 font-medium">
                  <div className="w-5 h-5 rounded-md bg-[#C9A227]/10 text-[#C9A227] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleStartComparing}
                className="inline-flex items-center gap-2 bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Start comparing
                <ArrowRight className="w-4 h-4" />
              </button>
              {hydrated && count > 0 && (
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 border border-stone-300 text-[#0c0c0c] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white transition-colors"
                >
                  View {count} selected
                </Link>
              )}
            </div>
            {hydrated && count > 0 && (
              <p className="text-xs text-stone-400 mt-3">{ids.length} propert{ids.length === 1 ? 'y' : 'ies'} in your compare tray</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
