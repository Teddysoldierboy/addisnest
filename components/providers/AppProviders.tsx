'use client';

import { CompareProvider } from '@/context/compare-context';
import { Toaster } from '@/components/ui/sonner';
import { CompareFloatingBar } from '@/components/compare/CompareFloatingBar';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      {children}
      <CompareFloatingBar />
      <Toaster position="top-center" richColors closeButton />
    </CompareProvider>
  );
}
