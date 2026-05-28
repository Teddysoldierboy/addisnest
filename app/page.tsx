"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortPrice, setSortPrice] = useState("default");

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("*");

    if (!error && data) {
      setListings(data);
      setFiltered(data);
    }
  }

  useEffect(() => {
    let result = [...listings];

    // Search
    if (search.trim()) {
      result = result.filter((listing) =>
        (
          listing.title +
          " " +
          listing.location
        )
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Buy/Rent filter
    if (typeFilter !== "all") {
      result = result.filter(
        (listing) =>
          listing.type?.toLowerCase() ===
          typeFilter.toLowerCase()
      );
    }

    // Price sorting
    if (sortPrice === "low") {
      result.sort(
        (a, b) =>
          parseFloat(a.price || 0) -
          parseFloat(b.price || 0)
      );
    }

    if (sortPrice === "high") {
      result.sort(
        (a, b) =>
          parseFloat(b.price || 0) -
          parseFloat(a.price || 0)
      );
    }

    setFiltered(result);
  }, [search, typeFilter, sortPrice, listings]);

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Find Your Perfect Property
      </h1>

      <div className="flex gap-4 mb-8 flex-wrap">
        <input
          type="text"
          placeholder="Search title or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded"
        />

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
          className="border p-3 rounded"
        >
          <option value="all">All</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>

        <select
          value={sortPrice}
          onChange={(e) =>
            setSortPrice(e.target.value)
          }
          className="border p-3 rounded"
        >
          <option value="default">Sort Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {filtered.map((listing) => (
          <Link
            key={listing.id}
            href={`/property/${listing.id}`}
          >
            <div className="border rounded-xl overflow-hidden shadow hover:shadow-lg cursor-pointer">
              <Image
                src={listing.image_url}
                alt={listing.title}
                width={500}
                height={300}
                className="w-full h-64 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-bold">
                  {listing.title}
                </h2>

                <p>{listing.location}</p>

                <p className="font-semibold mt-2">
                  ETB {listing.price}
                </p>

                <span className="inline-block mt-2 bg-black text-white px-3 py-1 rounded">
                  {listing.type}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}