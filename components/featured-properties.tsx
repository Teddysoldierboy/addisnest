"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FeaturedProperties({ mode }: any) {
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("listing_type", mode);

      if (search) {
        query = query.ilike("location", `%${search}%`);
      }

      const { data } = await query.limit(6);

      setProperties(data || []);
    };

    fetchProperties();
  }, [mode, search]);

  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Featured Properties
      </h2>

      <input
        type="text"
        placeholder="Search by location (Bole, CMC, Kazanchis...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mx-auto block border p-3 rounded-lg mb-8"
      />

      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((p) => (
          <Link
            href={`/property/${p.id}`}
            key={p.id}
            className="border rounded-xl overflow-hidden shadow block"
          >
            <img
              src={p.image_url}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p>{p.location}</p>
              <p className="font-bold">
                ETB {p.price?.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}