"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminListingsPage() {
  const [properties, setProperties] = useState<any[]>([]);

  async function fetchProperties() {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setProperties(data);
  }

  async function toggleStatus(id: string, current: string) {
    await supabase
      .from("properties")
      .update({
        status: current === "live" ? "draft" : "live",
      })
      .eq("id", id);

    fetchProperties();
  }

  async function deleteProperty(id: string) {
    await supabase.from("properties").delete().eq("id", id);
    fetchProperties();
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Listings</h1>

      <div className="space-y-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="border rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold text-xl">{property.title}</h2>
              <p>{property.location}</p>
              <p className="font-semibold">
                ETB {property.price?.toLocaleString()}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  property.status === "live"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {property.status}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  toggleStatus(property.id, property.status)
                }
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                {property.status === "live" ? "Hide" : "Publish"}
              </button>

              <button
                onClick={() => deleteProperty(property.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}