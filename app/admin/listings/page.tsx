export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { getProperties } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { AdminListingsActions } from '@/components/admin/AdminListingsActions';
import { Pencil, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/admin/login');

  const params = await searchParams;
  const properties = await getProperties({
    admin: true,
    status: params.status || undefined,
    search: params.search || undefined,
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">All Listings</h1>
            <p className="text-sm text-neutral-500 mt-1">{properties.length} properties</p>
          </div>
          <Link
            href="/admin/listings/new"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add new
          </Link>
        </div>

        <Suspense fallback={null}>
          <AdminListingsActions />
        </Suspense>

        <div className="mt-4 bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400">Property</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-neutral-400">Price</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-neutral-400">Type</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-neutral-400">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-neutral-400 text-sm">
                      No listings found
                    </td>
                  </tr>
                )}
                {properties.map((p) => (
                  <tr key={p.id} className="border-t border-neutral-50 hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-neutral-800 truncate max-w-[220px]">{p.title}</p>
                      <p className="text-xs text-neutral-400">{p.location}</p>
                    </td>
                    <td className="px-3 py-3 font-semibold text-neutral-900">
                      {formatPrice(p.price)}
                      {p.listing_type === 'rent' && (
                        <span className="text-xs font-normal text-neutral-400">/mo</span>
                      )}
                    </td>
                    <td className="px-3 py-3 capitalize text-neutral-600">{p.listing_type}</td>
                    <td className="px-3 py-3 capitalize text-neutral-600">{p.status}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/listings/${p.id}/edit`}
                        className="inline-flex w-8 h-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
