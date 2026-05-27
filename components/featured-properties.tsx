"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function FeaturedProperties({ mode }: any) {
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      
      // 1. Target the correct table & filter by listing mode ('buy' / 'rent')
      // 2. CRITICAL: Only fetch properties where status is 'live' so drafts don't leak
      let query = supabase
        .from("properties")
        .select("*")
        .eq("listing_type", mode)
        .eq("status", "live");

      if (search) {
        query = query.ilike("location", `%${search}%`);
      }

      // Limit showcase to most recent 6 active entries
      const { data } = await query
        .order("created_at", { ascending: false })
        .limit(6);

      setProperties(data || []);
      setLoading(false);
    };

    fetchProperties();
  }, [mode, search]);

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">
        Featured Properties
      </h2>
      <p className="text-gray-500 text-center mb-8 text-sm">
        Explore premium handpicked spaces available for {mode === "buy" ? "purchase" : "rent"} in Addis Ababa
      </p>

      {/* Location Search Bar Filter */}
      <div className="max-w-md mx-auto mb-12">
        <input
          type="text"
          placeholder="Search by neighborhood (Bole, CMC, Kazanchis...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 p-3 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12 text-sm font-medium">
          Loading listings from AddisNest marketplace...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((p) => (
            <Link
              href={`/property/${p.id}`}
              key={p.id}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Card Image Thumbnail Block */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-100">
                    🏢 No Image Provided
                  </div>
                )}
                
                {p.category && (
                  <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md">
                    {p.category}
                  </span>
                )}
              </div>

              {/* Card Bottom Meta Data Frame */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">📍 {p.location || "Addis Ababa"}</p>

                  {/* Property Specs Indicators Row */}
                  <div className="flex gap-4 text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">🛏️ {p.bedrooms || 0} Beds</span>
                    <span className="flex items-center gap-1">🛁 {p.bathrooms || 0} Baths</span>
                    <span className="flex items-center gap-1">📐 {p.area || 0} sqm</span>
                  </div>
                </div>

                {/* Price Display Frame */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-lg font-black text-black">
                    {p.price ? `${Number(p.price).toLocaleString()} ETB` : "Contact Agent"}
                  </p>
                  <span className="text-xs font-semibold text-blue-600 group-hover:underline">Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty States Filter Feedback Fallback */}
      {!loading && properties.length === 0 && (
        <p className="text-center text-gray-400 py-12 border border-dashed rounded-2xl bg-white max-w-xl mx-auto text-sm">
          No live properties match your search location criteria right now.
        </p>
      )}
    </section>
  );
}