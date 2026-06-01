export type ListingType = 'buy' | 'rent' | 'lease';
export type PropertyStatus = 'active' | 'hidden' | 'draft' | 'pending' | 'sold' | 'rented';

export interface Property {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  location: string;
  listing_type: ListingType | string;
  category: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  status: PropertyStatus | string;
  image_url?: string | null;
  images: string[];
  featured_image?: string | null;
  is_featured?: boolean;
  views?: number;
  amenities?: string[] | null;
  agent_name?: string | null;
  agent_phone?: string | null;
  agent_whatsapp?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFilters {
  status?: string;
  listing_type?: string;
  category?: string;
  bedrooms?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  /** When true, do not restrict to active listings (admin views). */
  admin?: boolean;
}
