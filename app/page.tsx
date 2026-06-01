"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Property } from "@/lib/types";
import { filterAndSortListings, parseNumericPrice } from "@/lib/property-search";
import { formatPrice } from "@/lib/utils";
import { toMapListings } from "@/components/map/AddisListingsMap";
import { AmenityBadges } from "@/components/property/AmenityBadges";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Bath, Ruler, Search, Map, LayoutGrid } from "lucide-react";

const AddisListingsMap = dynamic(
  () => import("@/components/map/AddisListingsMap").then((m) => m.AddisListingsMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] rounded-2xl bg-neutral-200 animate-pulse flex items-center justify-center text-neutral-500 text-sm">
        Loading Addis Ababa map…
      </div>
    ),
  }
);

function normalizeRow(raw: Record<string, unknown>): Property {
  const images: string[] = Array.isArray(raw.images) && raw.images.length > 0
    ? (raw.images as string[])
    : raw.image_url
      ? [String(raw.image_url)]
      : [];

  const amenities = Array.isArray(raw.amenities)
    ? (raw.amenities as string[])
    : [];

  return {
    ...(raw as unknown as Property),
    images,
    amenities,
    featured_image: (raw.featured_image as string) ?? images[0] ?? null,
    latitude: raw.latitude != null ? Number(raw.latitude) : null,
    longitude: raw.longitude != null ? Number(raw.longitude) : null,
  };
}

export default function HomePage() {
  const [listings, setListings] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortPrice, setSortPrice] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [loading, setLoading] = useState(true);
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setDatabaseError(null);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("listings")
          .select("*");

        if (fallbackError) {
          setDatabaseError(
            `Supabase could not find 'properties' or 'listings' tables. Error: ${fallbackError.message}`
          );
          setListings([]);
        } else {
          setListings((fallbackData ?? []).map((row) => normalizeRow(row as Record<string, unknown>)));
        }
      } else {
        setListings((data ?? []).map((row) => normalizeRow(row as Record<string, unknown>)));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected connection error occurred.";
      setDatabaseError(message);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    setFiltered(filterAndSortListings(listings, search, typeFilter, sortPrice));
  }, [search, typeFilter, sortPrice, listings]);

  const mapListings = toMapListings(filtered);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="bg-neutral-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find Your Home in <span className="text-amber-400">Addis Ababa</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base">
            Browse verified listings across the capital&apos;s premier neighborhoods.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-3 bg-white p-2 rounded-2xl shadow-xl text-neutral-900">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search title, location, description, category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              autoComplete="off"
            />
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full md:w-40 text-neutral-700 text-sm px-3 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            >
              <option value="all">All Types</option>
              <option value="buy">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
            <select
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="w-full md:w-44 text-neutral-700 text-sm px-3 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            >
              <option value="default">Sort: Default</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
          </div>
        </div>

        <p className="text-center text-neutral-500 text-xs mt-3">
          {loading ? "Loading listings…" : `${filtered.length} of ${listings.length} properties match`}
        </p>
      </div>

      {databaseError && (
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100">
            <strong>Connection error:</strong> {databaseError}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Marketplace</h2>
          <div className="flex rounded-xl border border-neutral-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === "map" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Map
            </button>
          </div>
        </div>

        {viewMode === "map" ? (
          <AddisListingsMap listings={mapListings} className="border border-neutral-200 shadow-sm" />
        ) : loading ? (
          <div className="text-center py-20 text-neutral-400 text-sm font-medium">
            Syncing records with live database…
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => {
              const price = parseNumericPrice(property.price);
              const isRent = property.listing_type === "rent";
              const hero =
                property.featured_image ??
                property.image_url ??
                property.images?.[0] ??
                null;

              return (
                <Link key={property.id} href={`/property/${property.id}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full">
                    <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                      {hero ? (
                        <Image
                          src={hero}
                          alt={property.title || "Property"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized={hero.startsWith("http")}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-neutral-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${
                            isRent ? "bg-blue-500/90" : "bg-emerald-500/90"
                          }`}
                        >
                          {isRent ? "For Rent" : "For Sale"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-xl font-bold text-neutral-900">
                        {price > 0 ? formatPrice(price) : "Contact for Price"}
                        {isRent && <span className="text-sm font-normal text-neutral-400">/mo</span>}
                      </p>
                      <h3 className="font-semibold text-neutral-800 mt-1 truncate">{property.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                        <p className="text-sm text-neutral-500 truncate">
                          {property.location || "Addis Ababa"}
                        </p>
                      </div>
                      <AmenityBadges amenities={property.amenities} className="mt-3" limit={3} />
                      {(property.bedrooms != null ||
                        property.bathrooms != null ||
                        property.area != null) && (
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-100 text-neutral-500">
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

        {!loading && filtered.length === 0 && !databaseError && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-200 max-w-md mx-auto mt-6">
            <h3 className="text-base font-semibold text-neutral-800 mb-1">No matches found</h3>
            <p className="text-neutral-400 text-sm mb-4">Try different keywords or reset filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setSortPrice("default");
              }}
              className="text-xs bg-neutral-900 text-white font-medium px-4 py-2 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
