"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // Form states
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("buy");
  const [category, setCategory] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("live");
  const [description, setDescription] = useState("");
  
  // Image states
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  
  // Status states
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch the existing property details when the page loads
  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  async function fetchPropertyDetails() {
    setFetching(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert("Error fetching property details");
      console.error(error);
      router.push("/admin/listings");
    } else if (data) {
      setTitle(data.title || "");
      setLocation(data.location || "");
      setPrice(data.price?.toString() || "");
      setType(data.listing_type || "buy");
      setCategory(data.category || "Apartment");
      setBedrooms(data.bedrooms || 1);
      setBathrooms(data.bathrooms || 1);
      setArea(data.area || 0);
      setFeatured(data.featured || false);
      setStatus(data.status || "live");
      setDescription(data.description || "");
      setExistingImageUrl(data.image_url || "");
    }
    setFetching(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let updatedImageUrl = existingImageUrl;

    // If the user selected a brand new file, upload it
    if (newImage) {
      const fileName = `${Date.now()}-${newImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, newImage);

      if (uploadError) {
        alert("New image upload failed");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      updatedImageUrl = data.publicUrl;
    }

    // Update the database row
    const { error } = await supabase
      .from("properties")
      .update({
        title,
        location,
        price: Number(price),
        listing_type: type,
        category,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        featured,
        status,
        description,
        image_url: updatedImageUrl
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update property");
      console.error(error);
    } else {
      alert("Property updated successfully!");
      router.push("/admin/listings"); // Redirect back to dashboard
    }

    setLoading(false);
  }

  if (fetching) return <div className="p-8 text-center text-lg">Loading property data...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex gap-4 mb-8">
        <Link href="/admin/listings" className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
          ← Back to Listings
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Edit Property</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        {/* Price & Listing Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border p-3 rounded-lg bg-white"
            >
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-3 rounded-lg bg-white"
            >
              <option>Apartment</option>
              <option>Villa</option>
              <option>Commercial</option>
              <option>Land</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-3 rounded-lg bg-white"
            >
              <option value="live">Live</option>
              <option value="hidden">Hidden</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Specs: Bedrooms, Bathrooms, Area */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              className="w-full border p-3 rounded-lg"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
              className="w-full border p-3 rounded-lg"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqm)</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full border p-3 rounded-lg"
              min="0"
              required
            />
          </div>
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center p-3 bg-gray-50 rounded-lg border">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-5 w-5 text-black border-gray-300 rounded focus:ring-black"
          />
          <label htmlFor="featured" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer select-none">
            Feature this listing on the home page
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded-lg"
            rows={5}
            required
          />
        </div>

        {/* Current & New Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Image</label>
          {existingImageUrl && !newImage && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Current Image:</p>
              <img src={existingImageUrl} alt="Current property view" className="w-32 h-32 object-cover rounded border" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          <p className="text-xs text-gray-400 mt-1">Leave blank to keep the current image.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
          
          <Link
            href="/admin/listings"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}