import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { listingsHref } from '@/lib/listings-filters';
import { toAppPath } from '@/lib/routes';

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Buy in Addis', href: '/listings?mode=buy' },
      { label: 'Rentals', href: '/listings?mode=rent' },
      { label: 'Verified listings', href: '/listings?verified=1' },
      { label: 'Featured homes', href: '/#featured' },
      { label: 'Compare properties', href: '/compare' },
      { label: 'Luxury projects', href: '/#projects' },
    ],
  },
  {
    title: 'Neighborhoods',
    links: [
      { label: 'Bole', href: listingsHref({ location: 'Bole' }) },
      { label: 'Kazanchis', href: listingsHref({ location: 'Kazanchis' }) },
      { label: 'CMC', href: listingsHref({ location: 'CMC' }) },
      { label: 'Old Airport', href: listingsHref({ location: 'Old Airport' }) },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Why AddisNest', href: '/#trust' },
      { label: 'Admin dashboard', href: '/admin/dashboard' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#0c0c0c] text-stone-300">
      <div className="max-w-7xl mx-auto section-padding !py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A227] text-[#0c0c0c] font-bold">
                AN
              </span>
              <span className="font-display text-2xl font-semibold text-white">AddisNest</span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed mb-6">
              Ethiopia&apos;s premium real estate marketplace. Verified listings, trusted agents, and
              world-class search across Addis Ababa.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A227]" />
                Bole, Addis Ababa, Ethiopia
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C9A227]" />
                +251 900 000 000
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C9A227]" />
                hello@addisnest.com
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={toAppPath(link.href)}
                      className="text-sm text-stone-400 hover:text-[#C9A227] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} AddisNest. All rights reserved. Prices in ETB.
          </p>
          <div className="flex items-center gap-4">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-full bg-stone-800 hover:bg-[#C9A227] hover:text-[#0c0c0c] transition-colors"
                aria-label="Social"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
