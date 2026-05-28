"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortPrice, setSortPrice] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setListings(data);
      setFiltered(data);
    }
    setLoading(false);
  }

  // Helper utility function to cleanly parse string prices (strips out ETB, commas, spaces, etc.)
  const getNumericPrice = (priceVal: any): number => {
    if (priceVal === null || priceVal === undefined) return 0;
    // Convert to string, strip everything except numbers and decimals
    const cleaned = String(priceVal).replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  useEffect(() => {
    let result = [...listings];

    // 1. Search across title + location with deep null safety
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter((listing) => {
        const titleText = listing.title ? String(listing.title).toLowerCase() : "";
        const locationText = listing.location ? String(listing.location).toLowerCase() : "";
        return titleText.includes(query) || locationText.includes(query);
      });
    }

    // 2. Buy/Rent filter (Handles absolute variations in capitalization flawlessly)
    if (typeFilter !== "all") {
      result = result.filter((listing) => {
        const listingType = listing.type ? String(listing.type).toLowerCase().trim() : "";
        return listingType === typeFilter.toLowerCase().trim();
      });
    }

    // 3. Robust Price Sorting (Evaluates clean floats even if raw data contains text artifacts)
    if (sortPrice === "low") {
      result.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    } else if (sortPrice === "high") {
      result.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    }

    setFiltered(result);
  }, [search, typeFilter, sortPrice, listings]);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Find Your Perfect Property
        </h1>
        <p className="text-sm text-gray-500 mt-1">Phase 2: Live Search & Smart Filters Running</p>
      </div>

      {/* Control Panel Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Search</label>
          <input
            type="text"
            placeholder="Search by title or neighborhood..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 p-3 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Listing Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-200 p-3 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all cursor-pointer h-[46px]"
          >
            <option value="all">All Properties</option>
            <option value="buy">For Buy / Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Order By</label>
          <select
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
            className="border border-gray-200 p-3 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all cursor-pointer h-[46px]"
          >
            <option value="default">Default Order</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Grid List Viewport */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading market listings...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => {
            const numericPrice = getNumericPrice(listing.price);
            return (
              <Link key={listing.id} href={`/property/${listing.id}`} className="group block">
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full">
                  <div className="relative w-full h-56 bg-gray-50 overflow-hidden">
                    {listing.image_url ? (
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">🏢 No Image</div>
                    )}
                    
                    <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md">
                      {listing.type || "Listing"}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {listing.title}
                      </h2>
                      <p className="text-gray-500 text-xs mt-1">📍 {listing.location || "Addis Ababa"}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <p className="text-base font-black text-black">
                        {numericPrice > 0 ? `${numericPrice.toLocaleString()} ETB` : "Contact Agent"}
                      </p>
                      <span className="text-xs font-semibold text-blue-600 group-hover:underline">View Details →</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Empty Filter State Fallback */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 max-w-md mx-auto mt-8">
          <p className="text-gray-400 text-sm">No listings match your filter selections or text search query.</p>
          <button
            onClick={() => { setSearch(""); setTypeFilter("all"); setSortPrice("default"); }}
            className="mt-3 text-xs font-bold text-black underline hover:text-gray-600"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </main>
  );
}