export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildSeedRows } from '@/lib/seed-properties';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = buildSeedRows();
  const { data, error } = await supabase.from('properties').insert(rows).select('id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    inserted: data?.length ?? rows.length,
    message: `Seeded ${data?.length ?? rows.length} premium Addis Ababa listings.`,
  });
}
