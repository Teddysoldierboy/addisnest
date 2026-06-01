'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AdminStats } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface AdminAnalyticsPanelProps {
  stats: AdminStats;
}

export function AdminAnalyticsPanel({ stats }: AdminAnalyticsPanelProps) {
  const financialCards = [
    {
      label: 'Projected monthly rent (active)',
      value: formatPrice(stats.totalMonthlyRent),
      sub: 'Sum of active rent listings',
      progress: Math.min(100, (stats.totalMonthlyRent / 2_000_000) * 100),
      color: 'bg-blue-500',
    },
    {
      label: 'Total for-sale asset value',
      value: formatPrice(stats.totalSaleValue),
      sub: 'Sum of active sale listings',
      progress: Math.min(100, (stats.totalSaleValue / 100_000_000) * 100),
      color: 'bg-emerald-500',
    },
    {
      label: 'Aggregate listing views',
      value: stats.totalViews.toLocaleString(),
      sub: 'Across all properties',
      progress: Math.min(100, (stats.totalViews / 500) * 100),
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financialCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
            <p className="text-xs font-medium text-neutral-500">{card.label}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{card.value}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{card.sub}</p>
            <div className="mt-3 h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div className={`h-full rounded-full ${card.color}`} style={{ width: `${card.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
          <h3 className="font-semibold text-neutral-900 mb-4">Top viewed listings</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topViewed}>
                <XAxis dataKey="title" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="views" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1">
            {stats.topViewed.map((row) => (
              <li key={row.id} className="flex justify-between text-xs text-neutral-600">
                <span className="truncate pr-2">{row.title}</span>
                <span className="font-semibold">{row.views} views</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
          <h3 className="font-semibold text-neutral-900 mb-4">Status breakdown</h3>
          <div className="space-y-3">
            {stats.statusBreakdown.map(({ status, count }) => {
              const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize text-neutral-600">{status}</span>
                    <span className="font-medium text-neutral-900">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-neutral-800"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
