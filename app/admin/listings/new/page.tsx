export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NewPropertyForm } from '@/components/admin/NewPropertyForm';

export default async function NewListingPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-neutral-900 mb-6">Add New Property</h1>
        <NewPropertyForm />
      </div>
    </div>
  );
}
