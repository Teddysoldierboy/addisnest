"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Connect to your Supabase project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminListingsPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all properties when the page loads
  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading properties:", error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  }

  // Toggle status between 'live' and 'hidden'
  async function toggleStatus(id: string, current: string) {
    const { error } = await supabase
      .from("properties")
      .update({
        status: current === "hidden" ? "live" : "hidden"
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update status.");
      console.error(error);
    } else {
      fetchProperties();
    }
  }

  // Toggle feature spotlight (true / false)
  async function toggleFeatured(id: string, current: boolean) {
    const { error } = await supabase
      .from("properties")
      .update({
        featured: !current
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update featured setting.");
      console.error(error);
    } else {
      fetchProperties();
    }
  }

  // Delete a property completely
  async function deleteProperty(id: string) {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing permanently?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete property.");
      console.error(error);
    } else {
      fetchProperties();
    }
  }

  if (loading) return <div className="p-8 text-center text-lg">Loading properties...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Property Listings</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Price</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b hover:bg-gray-50">
                {/* Property Thumbnail */}
                <td className="p-4">
                  {property.image_url ? (
                    <img src={property.image_url} alt="Property" className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">No Image</div>
                  )}
                </td>

                {/* Text Details */}
                <td className="p-4 font-medium">{property.title}</td>
                <td className="p-4 capitalize">{property.listing_type}</td>
                <td className="p-4">{Number(property.price).toLocaleString()} ETB</td>
                
                {/* Spotlight Status */}
                <td className="p-4">
                  {property.featured ? (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                      ★ Featured
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Standard</span>
                  )}
                </td>

                {/* Visibility Badge */}
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                    property.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status || 'live'}
                  </span>
                </td>

                {/* Interactive Action Control Row */}
                <td className="p-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => router.push(`/admin/edit/${property.id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleStatus(property.id, property.status)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                    >
                      {property.status === "hidden" ? "Show" : "Hide"}
                    </button>

                    <button
                      onClick={() => toggleFeatured(property.id, property.featured)}
                      className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors"
                    >
                      {property.featured ? "Unfeature" : "Feature"}
                    </button>

                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Edge Case Fallback Statement */}
            {properties.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No properties found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}