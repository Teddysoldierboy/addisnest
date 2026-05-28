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
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    setDatabaseError(null);

    // Connected to your accurate table: "properties"
    const { data, error } = await supabase
      .from("properties")
      .select("*");

    if (error) {
      console.error("Supabase Fetch Error:", error);
      setDatabaseError(error.message);
    } else {
      // Gracefully filter out drafts so users only see live listings
      const liveItems = (data || []).filter(item => item.status !== "hidden" && item.status !== "draft");
      setListings(liveItems);
      setFiltered(liveItems);
    }
    setLoading(false);
  }

  // Helper utility to safely convert any text-based or clean price to a working number
  const parseNumericPrice = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const cleaned = String(value).replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  useEffect(() => {
    let result = [...listings];

    // 1. Live Search across Title and Location fields
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (listing) =>
          listing.title?.toLowerCase().includes(query) ||
          listing.location?.toLowerCase().includes(query)
      );
    }

    // 2. Buy/Rent filter looking at both fallback columns 'listing_type' and 'type'
    if (typeFilter !== "all") {
      const filterTarget = typeFilter.toLowerCase().trim();
      result = result.filter((listing) => {
        const actualType = (listing.listing_type || listing.type || "").toLowerCase().trim();
        return actualType === filterTarget;
      });
    }

    // 3. Mathematical Price Sorting Engine
    if (sortPrice === "low") {
      result.sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price));
    } else if (sortPrice === "high") {
      result.sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price));
    }

    setFiltered(result);
  }, [search, typeFilter, sortPrice, listings]);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Brand Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          AddisNest
        </h1>
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-1">
          Premium Real Estate Discovery Engine
        </p>
      </div>

      {/* Control Panel: PERFECT SIDE-BY-SIDE GRID BAR FOR DESKTOP */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full mb-10 bg-white p-3 rounded-2xl border border-gray-100 shadow-xs">
        
        {/* Search Input Box */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="🔍 Search location, neighborhood, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all h-12"
          />
        </div>

        {/* Buy / Rent Dropdown Filter */}
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

        {/* Low/High Pricing Sort Dropdown */}
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

      {/* Error Announcement Display Box */}
      {databaseError && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100">
          ⚠️ <strong>Database Connection Issue:</strong> {databaseError}. Please verify your table name schema parameters inside Supabase.
        </div>
      )}

      {/* Grid Content Results Viewport */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm font-medium tracking-wide">
          Synchronizing real-time listings with Supabase cluster...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => {
            const displayPrice = parseNumericPrice(listing.price);
            const currentType = listing.listing_type || listing.type || "buy";
            
            return (
              <Link key={listing.id} href={`/property/${listing.id}`} className="group block">
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full justify-between">
                  
                  {/* Visual Layout Thumbnail Wrapper */}
                  <div className="h-48 w-full bg-gray-50 flex items-center justify-center relative overflow-hidden border-b border-gray-100">
                    {listing.image_url ? (
                      <img 
                        src={listing.image_url} 
                        alt={listing.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">🏢 No Media Layout</span>
                    )}
                    
                    {/* Absolute Context Status Badge Overlay */}
                    <span className={`absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md text-white shadow-xs ${
                      String(currentType).toLowerCase() === 'rent' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      For {currentType}
                    </span>
                  </div>

                  {/* Info Metadata Block */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                        {listing.title}
                      </h2>
                      <p className="text-gray-500 text-xs mt-1 font-medium">
                        📍 {listing.location || "Addis Ababa"}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-base font-black text-black">
                        {displayPrice > 0 ? `${displayPrice.toLocaleString()} ETB` : "Inquire for Price"}
                      </p>
                      <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                        Explore Details →
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Empty Search Filter Exception Fallback */}
      {!loading && filtered.length === 0 && !databaseError && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 max-w-md mx-auto mt-6">
          <p className="text-gray-400 text-sm font-medium">No properties match your active filter selections or search values right now.</p>
          <button
            onClick={() => { setSearch(""); setTypeFilter("all"); setSortPrice("default"); }}
            className="mt-3 text-xs font-bold text-black underline hover:text-gray-600 transition-colors"
          >
            Clear Search Conditions
          </button>
        </div>
      )}
    </main>
  );
}