export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { PropertyEditForm } from '@/components/admin/PropertyEditForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/admin/login');

  const { data: property } = await supabase.from('properties').select('*').eq('id', id).single();

  if (!property) notFound();

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-neutral-900 mb-6">Edit Property</h1>
        <PropertyEditForm property={property} />
      </div>
    </div>
  );
}
