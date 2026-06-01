'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [downPercent, setDownPercent] = useState(20);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(14);

  const principal = propertyPrice * (1 - downPercent / 100);
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  const payment =
    monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : principal / months;

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-[#0c0c0c] mb-1">Mortgage estimator</h3>
      <p className="text-xs text-stone-500 mb-5">Indicative ETB monthly payment (Ethiopian market rates vary)</p>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-stone-600">Down payment ({downPercent}%)</label>
          <input
            type="range"
            min={10}
            max={50}
            value={downPercent}
            onChange={(e) => setDownPercent(Number(e.target.value))}
            className="w-full mt-1 accent-[#C9A227]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-stone-600">Term ({years} years)</label>
          <input
            type="range"
            min={5}
            max={30}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full mt-1 accent-[#C9A227]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-stone-600">Interest rate ({rate}%)</label>
          <input
            type="range"
            min={8}
            max={22}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full mt-1 accent-[#C9A227]"
          />
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-100">
        <p className="text-xs text-stone-500">Estimated monthly</p>
        <p className="text-2xl font-bold text-[#0c0c0c]">{formatPrice(Math.round(payment))}</p>
      </div>
    </div>
  );
}
