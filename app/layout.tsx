import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AddisNest | Premium Real Estate in Addis Ababa',
    template: '%s | AddisNest',
  },
  description:
    'Discover verified apartments, villas, and commercial properties for sale and rent across Addis Ababa, Ethiopia. Premium listings in ETB.',
  keywords: ['Addis Ababa real estate', 'Ethiopia property', 'rent apartment Addis', 'buy home Ethiopia'],
  openGraph: {
    title: 'AddisNest — Premium Ethiopian Real Estate',
    description: 'Luxury property marketplace for Addis Ababa',
    type: 'website',
    locale: 'en_ET',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
