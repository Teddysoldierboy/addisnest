export type ListingType = 'rent' | 'buy' | 'lease';
export type PropertyCategory = 'apartment' | 'house' | 'villa' | 'office' | 'land' | 'commercial';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'hidden';

export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  image_url: string | null;        // legacy — keep for compat
  images: string[];                // new multi-image array
  featured_image: string | null;
  listing_type: ListingType;
  category: PropertyCategory;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  status: PropertyStatus;
  agent_name: string | null;
  agent_phone: string | null;
  agent_whatsapp: string | null;
  is_featured: boolean;
  views: number;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  listing_type?: ListingType | 'all';
  category?: PropertyCategory | 'all';
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  location?: string;
  search?: string;
  status?: PropertyStatus;
}