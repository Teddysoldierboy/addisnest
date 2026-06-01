import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ListingsPageContent } from '@/components/marketplace/ListingsPageContent';

export const metadata: Metadata = {
  title: 'Browse Properties',
  description: 'Search verified apartments and homes for sale and rent across Addis Ababa.',
};

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500">Loading listings…</div>
      }
    >
      <ListingsPageContent />
    </Suspense>
  );
}
