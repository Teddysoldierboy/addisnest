import { PremiumPropertyCard } from '@/components/marketplace/PremiumPropertyCard';
import type { Property } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <div className={cn(className)}>
      <PremiumPropertyCard property={property} />
    </div>
  );
}
