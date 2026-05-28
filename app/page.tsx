"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
    const { data } = await supabase
      .from("listings")
      .select("*");

    setListings(data || []);
    setFiltered(data || []);
  }

  useEffect(() => {
    let result = [...listings];

    if (search) {
      result = result.filter(
        (listing) =>
          listing.title?.toLowerCase().includes(search.toLowerCase()) ||
          listing.location?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      result = result.filter(
        (listing) =>
          listing.type?.toLowerCase() === typeFilter
      );
    }

    if (sortPrice === "low") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sortPrice === "high") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    setFiltered(result);
  }, [search, typeFilter, sortPrice, listings]);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        AddisNest
      </h1>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Search location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2"
        >
          <option value="all">All</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>

        <select
          value={sortPrice}
          onChange={(e) => setSortPrice(e.target.value)}
          className="border p-2"
        >
          <option value="default">Sort Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.map((listing) => (
          <div
            key={listing.id}
            className="border p-4 rounded"
          >
            <h2>{listing.title}</h2>
            <p>{listing.location}</p>
            <p>{listing.type}</p>
            <p>ETB {listing.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}