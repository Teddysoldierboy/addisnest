"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { propertyPath } from "@/lib/routes";
import { MapPin, Bed, Bath, Ruler } from "lucide-react";

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

export default function FeaturedProperties({ mode }: { mode: "buy" | "rent" }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        let query = supabase
          .from("properties")
          .select("*")
          .eq("listing_type", mode)
          .eq("status", "active");

        if (search.trim()) {
          query = query.ilike("location", `%${search.trim()}%`);
        }

        const { data, error: qErr } = await query
          .order("created_at", { ascending: false })
          .limit(6);

        if (qErr) throw qErr;
        setProperties(data || []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load featured properties");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchProperties();
  }, [mode, search]);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">
          Featured Properties
        </h2>
        <p className="text-neutral-500 text-sm">
          Explore premium handpicked spaces available for {mode === "buy" ? "purchase" : "rent"} in Addis Ababa
        </p>
      </div>

      {/* Unified Text Filter Field Box */}
      <div className="max-w-md mx-auto mb-12">
        <input
          type="text"
          placeholder="Filter by neighborhood (Bole, CMC, Kazanchis...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-neutral-200 px-4 py-3 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm placeholder-neutral-400 text-neutral-900"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100 text-center max-w-md mx-auto">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-neutral-400 py-16 text-sm font-medium">
          Syncing marketplace records...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => {
            const isRent = p.listing_type === 'rent';
            return (
              <Link
                href={propertyPath(p.id)}
                key={p.id}
                className="group bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full justify-between"
              >
                <div>
                  {/* Next.js Optimized Image Frame */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-50 border-b border-neutral-100">
                    {p.image_url && p.image_url.trim() !== "" ? (
                      <Image
                        src={p.image_url}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={p.image_url.startsWith('http')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                        <MapPin className="w-7 h-7 text-neutral-300" />
                      </div>
                    )}
                    
                    {p.category && (
                      <span className="absolute top-3 left-3 bg-neutral-900/90 backdrop-blur-xs text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md">
                        {p.category}
                      </span>
                    )}
                  </div>

                  {/* Metadata Content Block */}
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-800 text-base truncate">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <p className="text-sm text-neutral-500 truncate">{p.location || "Addis Ababa"}</p>
                    </div>

                    {/* Unified Lucide Property Specs Badges Row */}
                    {(p.bedrooms != null || p.bathrooms != null || p.area != null) && (
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-neutral-100 text-neutral-500">
                        {p.bedrooms != null && (
                          <div className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5" />
                            <span className="text-xs">{p.bedrooms} bd</span>
                          </div>
                        )}
                        {p.bathrooms != null && (
                          <div className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5" />
                            <span className="text-xs">{p.bathrooms} ba</span>
                          </div>
                        )}
                        {p.area != null && (
                          <div className="flex items-center gap-1">
                            <Ruler className="w-3.5 h-3.5" />
                            <span className="text-xs">{p.area} m²</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Price Row Footprint */}
                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-neutral-100 flex justify-between items-center">
                    <p className="text-lg font-bold text-neutral-900">
                      {p.price ? formatPrice(Number(p.price)) : "Inquire For Price"}
                      {isRent && <span className="text-xs font-normal text-neutral-400">/mo</span>}
                    </p>
                    <span className="text-xs font-semibold text-amber-600 group-hover:underline">Details →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Empty Filter Layout */}
      {!loading && properties.length === 0 && (
        <div className="text-center py-16 bg-white border border-dashed border-neutral-200 rounded-2xl max-w-md mx-auto">
          <h3 className="text-sm font-semibold text-neutral-800 mb-0.5">No matching listings</h3>
          <p className="text-neutral-400 text-xs">No active featured items matched that specific neighborhood filter criteria.</p>
        </div>
      )}
    </section>
  );
}