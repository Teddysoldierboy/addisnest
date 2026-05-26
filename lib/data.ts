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
    title: "Cozy Studio in Kazanchis",
    price: 35000,
    priceFormatted: "ETB 35,000/mo",
    type: "rent",
    location: "Kazanchis",
    bedrooms: 1,
    bathrooms: 1,
    sqm: 55,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    verified: true,
  },
  {
    id: "4",
    title: "Family Apartment in Gerji",
    price: 6200000,
    priceFormatted: "ETB 6,200,000",
    type: "sale",
    location: "Gerji",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 130,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    verified: false,
  },
  {
    id: "5",
    title: "Executive Suite in Summit",
    price: 75000,
    priceFormatted: "ETB 75,000/mo",
    type: "rent",
    location: "Summit",
    bedrooms: 2,
    bathrooms: 2,
    sqm: 95,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    verified: true,
  },
  {
    id: "6",
    title: "New Build in Ayat",
    price: 4800000,
    priceFormatted: "ETB 4,800,000",
    type: "sale",
    location: "Ayat",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 90,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
    verified: true,
  },
  {
    id: "7",
    title: "Spacious Villa in Sarbet",
    price: 22000000,
    priceFormatted: "ETB 22,000,000",
    type: "sale",
    location: "Sarbet",
    bedrooms: 5,
    bathrooms: 4,
    sqm: 350,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    verified: true,
  },
  {
    id: "8",
    title: "Modern Flat in Bole Atlas",
    price: 55000,
    priceFormatted: "ETB 55,000/mo",
    type: "rent",
    location: "Bole",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 80,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    verified: true,
  },
]

export const locations = [
  { value: "bole", label: "Bole" },
  { value: "cmc", label: "CMC" },
  { value: "gerji", label: "Gerji" },
  { value: "summit", label: "Summit" },
  { value: "ayat", label: "Ayat" },
  { value: "kazanchis", label: "Kazanchis" },
  { value: "sarbet", label: "Sarbet" },
]

export const priceRanges = [
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

export const popularAreas = [
  {
    name: "Bole",
    properties: 245,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
    description: "Premium area with international businesses and luxury apartments"
  },
  {
    name: "CMC",
    properties: 189,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
    description: "Growing residential area with modern developments"
  },
  {
    name: "Kazanchis",
    properties: 156,
    image: "https://images.unsplash.com/photo-1464938050520-ef2571be9727?w=400&q=80",
    description: "Central location near embassies and business district"
  },
  {
    name: "Summit",
    properties: 98,
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400&q=80",
    description: "Upscale neighborhood with scenic views"
  },
]
