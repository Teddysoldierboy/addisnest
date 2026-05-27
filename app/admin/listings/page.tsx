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

  // Inline editing state tracking handles settings safely
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

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

  // Update inline property text values and specifications
  async function updateListing(id: string) {
    const { error } = await supabase
      .from("properties")
      .update({
        title: editData.title,
        listing_type: editData.listing_type,
        price: Number(editData.price) // Guarantees database numeric type validation
      })
      .eq("id", id);

    if (error) {
      alert(`Failed to save adjustments: ${error.message}`);
      return;
    }

    alert("Listing updated successfully!");
    setEditingId(null);
    fetchProperties();
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

                {/* Inline Editable Title Details */}
                <td className="p-4 font-medium">
                  {editingId === property.id ? (
                    <input
                      type="text"
                      value={editData.title || ""}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="border p-2 rounded w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  ) : (
                    property.title
                  )}
                </td>

                {/* Inline Editable Deal Listing Type */}
                <td className="p-4 capitalize">
                  {editingId === property.id ? (
                    <select
                      value={editData.listing_type || "buy"}
                      onChange={(e) => setEditData({ ...editData, listing_type: e.target.value })}
                      className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="buy">Buy</option>
                      <option value="rent">Rent</option>
                    </select>
                  ) : (
                    property.listing_type
                  )}
                </td>

                {/* Inline Editable Price Numerical Core */}
                <td className="p-4">
                  {editingId === property.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editData.price || ""}
                        onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                        className="border p-2 rounded w-28 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <span className="text-sm text-gray-500">ETB</span>
                    </div>
                  ) : (
                    `${Number(property.price).toLocaleString()} ETB`
                  )}
                </td>
                
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

                {/* Alternating Action Controls Row */}
                <td className="p-4">
                  <div className="flex gap-2 justify-center">
                    {editingId === property.id ? (
                      <>
                        <button
                          onClick={() => updateListing(property.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(property.id);
                            setEditData(property);
                          }}
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
                      </>
                    )}
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