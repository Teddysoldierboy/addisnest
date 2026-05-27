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

  // Inline editing state tracking
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // Handle comprehensive property updates including storage file uploads
  async function updateListing(id: string) {
    setUploadingImage(true);
    let imageUrl = editData.image_url;

    // 1. Process new image file upload if selected
    if (editData.newImage) {
      const file = editData.newImage;
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, file);

      if (uploadError) {
        alert(`Image upload error: ${uploadError.message}`);
        setUploadingImage(false);
        return;
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    // 2. Save all modifications to the properties table
    const { error } = await supabase
      .from("properties")
      .update({
        title: editData.title,
        description: editData.description,
        location: editData.location,
        listing_type: editData.listing_type,
        price: Number(editData.price),
        image_url: imageUrl,
      })
      .eq("id", id);

    setUploadingImage(false);

    if (error) {
      alert(`Failed to save adjustments: ${error.message}`);
      return;
    }

    alert("Listing updated safely!");
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
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Property Listings</h1>
      
      <div className="bg-white shadow rounded-lg overflow-x-auto border border-gray-200">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-100 border-b text-sm text-gray-700">
              <th className="p-4 w-32">Image</th>
              <th className="p-4 w-48">Title</th>
              <th className="p-4 w-64">Description</th>
              <th className="p-4 w-40">Location</th>
              <th className="p-4 w-24">Type</th>
              <th className="p-4 w-36">Price</th>
              <th className="p-4 w-28">Featured</th>
              <th className="p-4 w-28">Status</th>
              <th className="p-4 text-center w-64">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {properties.map((property) => (
              <tr key={property.id} className="border-b hover:bg-gray-50 items-start">
                
                {/* Image Gallery Column View & Live File Loader */}
                <td className="p-4 vertical-align-top">
                  {editingId === property.id ? (
                    <div className="space-y-2">
                      {editData.image_url ? (
                        <img src={editData.image_url} alt="Current" className="w-20 h-20 object-cover rounded border" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            newImage: e.target.files?.[0],
                            image_url: e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : editData.image_url
                          })
                        }
                        className="text-xs w-full block"
                      />
                      {editData.image_url && (
                        <button
                          type="button"
                          onClick={() => setEditData({ ...editData, image_url: "", newImage: null })}
                          className="text-xs text-red-600 block hover:underline"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  ) : (
                    property.image_url ? (
                      <img src={property.image_url} alt="Property" className="w-20 h-20 object-cover rounded" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs">No Image</div>
                    )
                  )}
                </td>

                {/* Text Title Details */}
                <td className="p-4 font-medium">
                  {editingId === property.id ? (
                    <input
                      type="text"
                      value={editData.title || ""}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  ) : (
                    property.title
                  )}
                </td>

                {/* Comprehensive Property Description Cell */}
                <td className="p-4">
                  {editingId === property.id ? (
                    <textarea
                      value={editData.description || ""}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="border p-2 rounded w-full text-xs focus:outline-none focus:ring-1 focus:ring-black"
                      rows={4}
                    />
                  ) : (
                    <p className="max-w-xs text-xs text-gray-600 line-clamp-3 title={property.description}">
                      {property.description || "No description provided."}
                    </p>
                  )}
                </td>

                {/* Subcity/Neighborhood Location Field */}
                <td className="p-4">
                  {editingId === property.id ? (
                    <input
                      type="text"
                      value={editData.location || ""}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="e.g. Bole, Addis Ababa"
                    />
                  ) : (
                    property.location || <span className="text-gray-400 italic text-xs">Not specified</span>
                  )}
                </td>

                {/* Deal Listing Type */}
                <td className="p-4 capitalize">
                  {editingId === property.id ? (
                    <select
                      value={editData.listing_type || "buy"}
                      onChange={(e) => setEditData({ ...editData, listing_type: e.target.value })}
                      className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-black w-full"
                    >
                      <option value="buy">Buy</option>
                      <option value="rent">Rent</option>
                    </select>
                  ) : (
                    property.listing_type
                  )}
                </td>

                {/* Numerical Price Field */}
                <td className="p-4">
                  {editingId === property.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editData.price || ""}
                        onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-black"
                      />
                      <span className="text-xs text-gray-500 font-medium">ETB</span>
                    </div>
                  ) : (
                    `${Number(property.price).toLocaleString()} ETB`
                  )}
                </td>
                
                {/* Spotlight Banner Status */}
                <td className="p-4">
                  {property.featured ? (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800 whitespace-nowrap">
                      ★ Featured
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Standard</span>
                  )}
                </td>

                {/* Visibility Configuration Badge */}
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                    property.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status || 'live'}
                  </span>
                </td>

                {/* Interactive State Alteration System Controls */}
                <td className="p-4">
                  <div className="flex gap-2 justify-center flex-wrap">
                    {editingId === property.id ? (
                      <>
                        <button
                          onClick={() => updateListing(property.id)}
                          disabled={uploadingImage}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        >
                          {uploadingImage ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          disabled={uploadingImage}
                          className="bg-gray-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-600 transition-colors"
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
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(property.id, property.status)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-600 transition-colors"
                        >
                          {property.status === "hidden" ? "Show" : "Hide"}
                        </button>
                        <button
                          onClick={() => toggleFeatured(property.id, property.featured)}
                          className="bg-purple-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-purple-600 transition-colors"
                        >
                          {property.featured ? "Unfeature" : "Feature"}
                        </button>
                        <button
                          onClick={() => deleteProperty(property.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Fallback Layout */}
            {properties.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
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