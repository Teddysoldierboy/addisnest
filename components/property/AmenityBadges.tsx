import { cn } from '@/lib/utils';

interface AmenityBadgesProps {
  amenities?: string[] | null;
  className?: string;
  limit?: number;
}

export function AmenityBadges({ amenities, className, limit = 4 }: AmenityBadgesProps) {
  const tags = (amenities ?? []).filter(Boolean);
  if (!tags.length) return null;

  const visible = limit > 0 ? tags.slice(0, limit) : tags;
  const remaining = tags.length - visible.length;

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {visible.map((tag) => (
        <span
          key={tag}
          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/80"
        >
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
