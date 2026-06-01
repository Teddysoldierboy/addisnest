export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminStats } from '@/lib/supabase/queries';
import { Building2, TrendingUp, Home, Eye } from 'lucide-react';
import { AdminAnalyticsPanel } from '@/components/admin/AdminAnalyticsPanel';
import { SeedDatabaseButton } from '@/components/admin/SeedDatabaseButton';
import { formatPrice } from '@/lib/utils';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/admin/login');

  const stats = await getAdminStats();

  const cards = [
    { label: 'Total Listings', value: stats.total, icon: Building2, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Listings', value: stats.active, icon: Home, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Rented Out', value: stats.rented, icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
    { label: 'Sold', value: stats.sold, icon: Eye, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">AddisNest Admin</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Portfolio value {formatPrice(stats.totalSaleValue)} · Rent pipeline {formatPrice(stats.totalMonthlyRent)}/mo
            </p>
          </div>
          <Link
            href="/admin/listings/new"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            + Add Property
          </Link>
        </div>

        <div className="mb-6">
          <SeedDatabaseButton />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{value}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <AdminAnalyticsPanel stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/listings"
            className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold text-neutral-900 group-hover:text-amber-600 transition-colors">
              Manage Listings →
            </h3>
            <p className="text-sm text-neutral-500 mt-1">Edit, delete, or update property visibility</p>
          </Link>
          <Link
            href="/admin/listings/new"
            className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold text-neutral-900 group-hover:text-amber-600 transition-colors">
              Add New Property →
            </h3>
            <p className="text-sm text-neutral-500 mt-1">Create a listing with crop-to-upload imagery</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
