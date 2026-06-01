import { createClient } from '@/lib/supabase/server';
import type { Property, PropertyFilters } from '@/lib/types';

export async function getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  // Added await here 👇
  const supabase = await createClient();
  
  let query = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  } else if (!filters.admin) {
    query = query.eq('status', 'active');
  }

  if (filters.listing_type && filters.listing_type !== 'all') {
    query = query.eq('listing_type', filters.listing_type);
  }
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.bedrooms) {
    query = query.gte('bedrooms', filters.bedrooms);
  }
  if (filters.min_price) {
    query = query.gte('price', filters.min_price);
  }
  if (filters.max_price) {
    query = query.lte('price', filters.max_price);
  }
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,location.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  let { data, error } = await query;

  if (error) {
    let fallback = supabase.from('listings').select('*').order('created_at', { ascending: false });
    if (filters.status) fallback = fallback.eq('status', filters.status);
    else if (!filters.admin) fallback = fallback.eq('status', 'active');
    const result = await fallback;
    data = result.data;
    error = result.error;
  }

  if (error) throw error;
  return (data ?? []).map(normalizeProperty);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  // Added await here 👇
  const supabase = await createClient();
  let { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    const fallback = await supabase.from('listings').select('*').eq('id', id).single();
    data = fallback.data;
    error = fallback.error;
  }

  if (error || !data) return null;
  
  // Increment views (fire and forget)
  supabase.from('properties').update({ views: (data.views ?? 0) + 1 }).eq('id', id);
  
  return normalizeProperty(data);
}

export async function getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
  // Added await here 👇
  const supabase = await createClient();
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .eq('category', property.category)
    .neq('id', property.id)
    .limit(limit);
  
  return (data ?? []).map(normalizeProperty);
}

export async function getAdminStats() {
  // Added await here 👇
  const supabase = await createClient();
  const [{ count: total }, { count: active }, { count: rented }, { count: sold }] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'rented'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'sold'),
  ]);
  return { total: total ?? 0, active: active ?? 0, rented: rented ?? 0, sold: sold ?? 0 };
}

// Normalize: ensure images array is always populated
function normalizeProperty(raw: Record<string, unknown>): Property {
  const images: string[] = Array.isArray(raw.images) && raw.images.length > 0
    ? raw.images as string[]
    : raw.image_url ? [raw.image_url as string] : [];
  
  return {
    ...(raw as unknown as Property),
    images,
    featured_image: (raw.featured_image as string) ?? images[0] ?? null,
  };
}