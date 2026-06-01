'use client';

import { Scale } from 'lucide-react';
import { useCompare } from '@/context/compare-context';
import { cn } from '@/lib/utils';

interface CompareToggleButtonProps {
  propertyId: string;
  className?: string;
  variant?: 'card' | 'inline';
}

export function CompareToggleButton({
  propertyId,
  className,
  variant = 'card',
}: CompareToggleButtonProps) {
  const { isSelected, toggle, canAdd, hydrated } = useCompare();
  const selected = hydrated && isSelected(propertyId);
  const disabled = hydrated && !selected && !canAdd;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(propertyId);
      }}
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold transition-all',
        variant === 'card'
          ? cn(
              'p-2 rounded-full backdrop-blur-md text-xs',
              selected
                ? 'bg-[#C9A227] text-[#0c0c0c]'
                : disabled
                  ? 'bg-black/20 text-white/40 cursor-not-allowed'
                  : 'bg-black/40 text-white hover:bg-black/60'
            )
          : cn(
              'px-3 py-2 rounded-xl text-sm border',
              selected
                ? 'bg-[#C9A227] text-[#0c0c0c] border-[#C9A227]'
                : disabled
                  ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                  : 'bg-white text-[#0c0c0c] border-stone-200 hover:border-[#C9A227]'
            ),
        className
      )}
      aria-label={selected ? 'Remove from comparison' : 'Add to comparison'}
      aria-pressed={selected}
    >
      <Scale className="w-3.5 h-3.5" />
      {variant === 'inline' && (selected ? 'Comparing' : 'Compare')}
    </button>
  );
}
