import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { PropertyEditForm } from '@/components/admin/PropertyEditForm';

interface Props {
  params: { id: string };
}

export default async function EditPropertyPage({ params }: Props) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/admin');

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single();

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