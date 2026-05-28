"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
    const { data } = await supabase
      .from("listings")
      .select("*");

    setListings(data || []);
    setFiltered(data || []);
    setLoading(false);
  }

  // Defensive helper function to cleanly parse raw prices to numbers
  const parseNumericPrice = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const cleaned = String(value).replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  useEffect(() => {
    let result = [...listings];

    // 1. Live Search across Title and Location
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (listing) =>
          listing.title?.toLowerCase().includes(query) ||
          listing.location?.toLowerCase().includes(query)
      );
    }

    // 2. Buy/Rent Filter (Capitalization agnostic execution)
    if (typeFilter !== "all") {
      const filterTarget = typeFilter.toLowerCase().trim();
      result = result.filter(
        (listing) =>
          listing.type?.toLowerCase().trim() === filterTarget
      );
    }

    // 3. Mathematical Price Sorting Matrix
    if (sortPrice === "low") {
      result.sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price));
    } else if (sortPrice === "high") {
      result.sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price));
    }

    setFiltered(result);
  }, [search, typeFilter, sortPrice, listings]);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Brand Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          AddisNest
        </h1>
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-1">
          Premium Real Estate Discovery Engine
        </p>
      </div>

      {/* Control Panel: Side-by-Side Filtering Engine */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full mb-10 bg-white p-3 rounded-2xl border border-gray-100 shadow-xs">
        
        {/* Search input expands to claim remaining horizontal space */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="🔍 Search location, neighborhood, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all h-12"
          />
        </div>

        {/* Buy / Rent Selector Dropdown */}
        <div className="w-full md:w-48 shrink-0">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all cursor-pointer h-12 font-medium"
          >
            <option value="all">All Operations</option>
            <option value="buy">For Purchase / Buy</option>
            <option value="rent">For Lease / Rent</option>
          </select>
        </div>

        {/* Pricing Sort Metric Dropdown */}
        <div className="w-full md:w-48 shrink-0">
          <select
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all cursor-pointer h-12 font-medium"
          >
            <option value="default">Sort by Price</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

      </div>

      {/* Listings Structural Matrix Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm font-medium tracking-wide">
          Synchronizing records with Supabase cluster...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => {
            const displayPrice = parseNumericPrice(listing.price);
            return (
              <div
                key={listing.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                {/* Visual Thumbnail Backup Block */}
                <div className="h-48 w-full bg-gray-50 flex items-center justify-center relative overflow-hidden border-b border-gray-100">
                  {listing.image_url ? (
                    <img 
                      src={listing.image_url} 
                      alt={listing.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">🏢 No Layout Media Provided</span>
                  )}
                  
                  {/* Absolute Top Badge Overlay */}
                  <span className={`absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md text-white shadow-xs ${
                    String(listing.type).toLowerCase() === 'rent' ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    For {listing.type || 'Sale'}
                  </span>
                </div>

                {/* Info Text Elements Body block */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                      {listing.title}
                    </h2>
                    <p className="text-gray-500 text-xs mt-1 font-medium">
                      📍 {listing.location || "Addis Ababa, Ethiopia"}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-base font-black text-black">
                      {displayPrice > 0 ? `${displayPrice.toLocaleString()} ETB` : "Inquire for Price"}
                    </p>
                    <span className="text-xs font-semibold text-blue-600 group-hover:underline cursor-pointer">
                      Explore Details →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State Result Overlay Card */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 max-w-md mx-auto mt-6">
          <p className="text-gray-400 text-sm font-medium">No live properties pass your active filter combination parameters.</p>
          <button
            onClick={() => { setSearch(""); setTypeFilter("all"); setSortPrice("default"); }}
            className="mt-3 text-xs font-bold text-black underline hover:text-gray-600 transition-colors"
          >
            Clear Active Filter Matrix
          </button>
        </div>
      )}
    </main>
  );
}