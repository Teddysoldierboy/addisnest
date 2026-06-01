export interface Property {
  id: string
  title: string
  price: number
  priceFormatted: string
  type: "sale" | "rent"
  location: string
  bedrooms: number
  bathrooms: number
  sqm: number
  image: string
  verified: boolean
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern 3BR Apartment in Bole",
    price: 8500000,
    priceFormatted: "ETB 8,500,000",
    type: "sale",
    location: "Bole",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 145,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    verified: true,
  },
  {
    id: "2",
    title: "Luxury Penthouse at CMC",
    price: 15000000,
    priceFormatted: "ETB 15,000,000",
    type: "sale",
    location: "CMC",
    bedrooms: 4,
    bathrooms: 3,
    sqm: 220,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    verified: true,
  },
  {
    id: "3",
    title: "Cozy 2BR in Kazanchis",
    price: 45000,
    priceFormatted: "ETB 45,000",
    type: "rent",
    location: "Kazanchis",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 95,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    verified: true,
  },
  {
    id: "4",
    title: "Spacious Villa in Old Airport",
    price: 22000000,
    priceFormatted: "ETB 22,000,000",
    type: "sale",
    location: "Old Airport",
    bedrooms: 5,
    bathrooms: 4,
    sqm: 350,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    verified: false,
  },
  {
    id: "5",
    title: "Studio Apartment Bole Bulbula",
    price: 25000,
    priceFormatted: "ETB 25,000",
    type: "rent",
    location: "Bole Bulbula",
    bedrooms: 1,
    bathrooms: 1,
    sqm: 55,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    verified: true,
  },
  {
    id: "6",
    title: "Family Home in Ayat",
    price: 6500000,
    priceFormatted: "ETB 6,500,000",
    type: "sale",
    location: "Ayat",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 180,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    verified: true,
  },
  {
    id: "7",
    title: "Modern Flat in Sarbet",
    price: 35000,
    priceFormatted: "ETB 35,000",
    type: "rent",
    location: "Sarbet",
    bedrooms: 2,
    bathrooms: 2,
    sqm: 110,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    verified: true,
  },
  {
    id: "8",
    title: "Heritage Loft in Piassa",
    price: 4200000,
    priceFormatted: "ETB 4,200,000",
    type: "sale",
    location: "Piassa",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 85,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    verified: true,
  },
]

export const buyPriceRanges = [
  { value: "any", label: "Any Price" },
  { value: "0-5000000", label: "Up to ETB 5M" },
  { value: "5000000-10000000", label: "ETB 5M - 10M" },
  { value: "10000000-20000000", label: "ETB 10M - 20M" },
  { value: "20000000+", label: "ETB 20M+" },
]

export const rentPriceRanges = [
  { value: "any", label: "Any Price" },
  { value: "0-30000", label: "Up to ETB 30,000/mo" },
  { value: "30000-50000", label: "ETB 30,000 - 50,000/mo" },
  { value: "50000-100000", label: "ETB 50,000 - 100,000/mo" },
  { value: "100000+", label: "ETB 100,000+/mo" },
]

export const bedroomOptions = [
  { value: "any", label: "Any Bedrooms" },
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4+ Bedrooms" },
]

/** High-quality Unsplash URLs (auto=format) — used for neighborhood cards */
export const popularAreas = [
  {
    name: 'Bole Atlas',
    searchTerm: 'Bole',
    properties: 245,
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Premium area with international businesses and luxury apartments',
  },
  {
    name: 'Kazanchis',
    searchTerm: 'Kazanchis',
    properties: 156,
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    description: 'Central location near embassies and business district',
  },
  {
    name: 'CMC',
    searchTerm: 'CMC',
    properties: 189,
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    description: 'Growing residential area with modern developments',
  },
  {
    name: 'Old Airport',
    searchTerm: 'Old Airport',
    properties: 132,
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    description: 'Walkable district with restaurants and modern lofts',
  },
  {
    name: 'Bole Bulbula',
    searchTerm: 'Bulbula',
    properties: 98,
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    description: 'Green belts and family-friendly apartment living',
  },
  {
    name: 'Ayat',
    searchTerm: 'Ayat',
    properties: 87,
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    description: 'Hillside townhouses with valley views',
  },
  {
    name: 'Sarbet',
    searchTerm: 'Sarbet',
    properties: 76,
    image:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
    description: 'Designer flats near major transport corridors',
  },
  {
    name: 'Piassa',
    searchTerm: 'Piassa',
    properties: 64,
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    description: 'Historic center with character lofts and culture',
  },
] as const;

export const AREA_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
