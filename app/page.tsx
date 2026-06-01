"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
// 1. CHANGED THIS IMPORT TO USE THE BROWSER CLIENT FACTORY FUNCTION
import { createClient } from "@/lib/supabase/client"; 
import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Bath, Ruler, Search } from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  image_url: string | null;
  listing_type: string;
  category: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  status: string;
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `ETB ${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `ETB ${(price / 1_000).toFixed(0)}K`;
  return `ETB ${price.toLocaleString()}`;
}

export default function HomePage() {
  const [listings, setListings] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortPrice, setSortPrice] = useState("default");
  const [loading, setLoading] = useState(true);
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    setDatabaseError(null);

    try {
      // 2. INITIALIZE THE BROWSER CLIENT DIRECTLY INSIDE THE FETCH FUNCTION
      const supabase = createClient();

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "active");

      if (error) {
        console.warn("Targeting 'properties' table failed, trying 'listings' fallback...", error);
        
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("listings")
          .select("*");

        if (fallbackError) {
          setDatabaseError(`Supabase could not find 'properties' or 'listings' tables. Error: ${fallbackError.message}`);
        } else {
          setListings(fallbackData || []);
          setFiltered(fallbackData || []);
        }
      } else {
        setListings(data || []);
        setFiltered(data || []);
      }
    } catch (err: any) {
      setDatabaseError(err.message || "An unexpected connection error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const parseNumericPrice = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    const cleaned = String(value).replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  useEffect(() => {
    let result = [...listings];

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (listing) =>
          listing.title?.toLowerCase().includes(query) ||
          listing.location?.toLowerCase().includes(query)
      );
    }

    if (typeFilter !== "all") {
      const filterTarget = typeFilter.toLowerCase().trim();
      result = result.filter((listing) => {
        const actualType = (listing.listing_type || "").toLowerCase().trim();
        return actualType === filterTarget;
      });
    }

    if (sortPrice === "low") {
      result.sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price));
    } else if (sortPrice === "high") {
      result.sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price));
    }

    setFiltered(result);
  }, [search, typeFilter, sortPrice, listings]);

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Header Filter Shell */}
      <div className="bg-neutral-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find Your Home in <span className="text-amber-400">Addis Ababa</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base">
            Browse verified listings across the capital's premier neighborhoods.
          </p>
        </div>

        {/* Unified Search Bar UI */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-3 bg-white p-2 rounded-2xl shadow-xl text-neutral-900">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by location, neighborhood, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl focus:outline-none"
            />
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full md:w-40 text-neutral-700 text-sm px-3 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="buy">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
            <select
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="w-full md:w-40 text-neutral-700 text-sm px-3 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none"
            >
              <option value="default">Sort Options</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Database Warning Banner */}
      {databaseError && (
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100">
            ⚠️ <strong>System Connection Error:</strong> {databaseError}
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-neutral-400 text-sm font-medium">
            Syncing records with live database cluster...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => {
              const price = parseNumericPrice(property.price);
              const isRent = property.listing_type === 'rent';

              return (
                <Link key={property.id} href={`/property/${property.id}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full">
                    
                    {/* Next.js Optimized Image Frame */}
                    <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                      {property.image_url && property.image_url.trim() !== "" ? (
                        <Image
                          src={property.image_url}
                          alt={property.title || "Property"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized={property.image_url.startsWith('http')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-neutral-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${
                          isRent ? 'bg-blue-500/90' : 'bg-emerald-500/90'
                        }`}>
                          {isRent ? 'For Rent' : 'For Sale'}
                        </span>
                      </div>
                    </div>

                    {/* Meta Card Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xl font-bold text-neutral-900">
                          {price > 0 ? formatPrice(price) : "Contact for Price"}
                          {isRent && <span className="text-sm font-normal text-neutral-400">/mo</span>}
                        </p>
                        <h3 className="font-semibold text-neutral-800 mt-1 truncate">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                          <p className="text-sm text-neutral-500 truncate">
                            {property.location || "Addis Ababa"}
                          </p>
                        </div>
                      </div>

                      {/* Dynamic Spec Badges Row */}
                      {(property.bedrooms != null || property.bathrooms != null || property.area != null) && (
                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-neutral-100 text-neutral-500">
                          {property.bedrooms != null && (
                            <div className="flex items-center gap-1">
                              <Bed className="w-3.5 h-3.5" />
                              <span className="text-xs">{property.bedrooms} bd</span>
                            </div>
                          )}
                          {property.bathrooms != null && (
                            <div className="flex items-center gap-1">
                              <Bath className="w-3.5 h-3.5" />
                              <span className="text-xs">{property.bathrooms} ba</span>
                            </div>
                          )}
                          {property.area != null && (
                            <div className="flex items-center gap-1">
                              <Ruler className="w-3.5 h-3.5" />
                              <span className="text-xs">{property.area} m²</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && !databaseError && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200 max-w-md mx-auto">
            <h3 className="text-base font-semibold text-neutral-800 mb-1">No matches found</h3>
            <p className="text-neutral-400 text-sm mb-4">Try altering your search text or removing filters.</p>
            <button
              onClick={() => { setSearch(""); setTypeFilter("all"); setSortPrice("default"); }}
              className="text-xs bg-neutral-900 text-white font-medium px-4 py-2 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}