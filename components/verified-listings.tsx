import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { listingsHref } from '@/lib/listings-filters';

export function VerifiedListings() {
  const browseHref = listingsHref({ verified: true });

  return (
    <section id="verified" className="py-20 bg-[#0c0c0c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6">
              Only Verified Listings You Can Trust
            </h2>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed">
              Every property on AddisNest passes our verification process — physical inspection,
              document checks, and accurate ETB pricing before going live.
            </p>
            <ul className="flex flex-col gap-4 mb-8">
              {[
                'Physical property inspection by our team',
                'Document verification and legal checks',
                'Ownership and title confirmation',
                'Accurate pricing and property details',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-stone-300">
                  <CheckCircle className="h-5 w-5 text-[#C9A227] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={browseHref}
              className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0c0c0c] font-semibold px-6 py-3 rounded-xl hover:bg-[#E8D48B] transition-colors"
            >
              Browse Verified Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4">
              <Link
                href="/#listings"
                className="text-sm text-stone-400 hover:text-[#C9A227] underline-offset-2 hover:underline"
              >
                Or scroll to listings on the homepage
              </Link>
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#C9A227]/20 flex items-center justify-center mb-6">
                  <CheckCircle className="h-12 w-12 text-[#C9A227]" />
                </div>
                <div className="text-5xl font-bold mb-2">100%</div>
                <p className="text-stone-400 text-lg">Active listings verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
