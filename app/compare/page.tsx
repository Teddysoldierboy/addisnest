import type { Metadata } from 'next';
import { ComparePageContent } from '@/components/compare/ComparePageContent';

export const metadata: Metadata = {
  title: 'Compare Properties',
  description: 'Compare up to four Addis Ababa property listings side by side with value analytics.',
};

export default function ComparePage() {
  return <ComparePageContent />;
}
