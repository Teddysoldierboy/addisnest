"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("buy");
  const [category, setCategory] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("draft");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState("");
  const [agentNotes, setAgentNotes] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const uploadedUrls: string[] = [];

    for (const image of images) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, image);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        uploadedUrls.push(data.publicUrl);
      }
    }

    const { error } = await supabase.from("properties").insert([
      {
        title,
        location,
        price: Number(price),
        listing_type: type,
        category,
        bedrooms,
        bathrooms,
        area,
        featured,
        status,
        description,
        amenities: amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        agent_notes: agentNotes,
        image_url: uploadedUrls[0] || "",
        gallery: uploadedUrls,
      },
    ]);

    if (error) {
      alert("Failed to add property");
      console.error(error);
    } else {
      alert("Property added successfully");

      setTitle("");
      setLocation("");
      setPrice("");
      setDescription("");
      setAmenities("");
      setAgentNotes("");
      setImages([]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">
              Manage listings professionally
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Add Property
            </Link>

            <Link
              href="/admin/listings"
              className="px-4 py-2 border rounded-lg"
            >
              Manage Listings
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Property Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-3 rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border p-3 rounded-lg"
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-3 rounded-lg"
                required
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border p-3 rounded-lg"
              >
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>

          {/* Property Specs */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">
              Property Specs
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="border p-3 rounded-lg"
              />

              <input
                type="number"
                placeholder="Bathrooms"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="border p-3 rounded-lg"
              />

              <input
                type="number"
                placeholder="Area sqm"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="border p-3 rounded-lg"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-3 rounded-lg"
              >
                <option>Apartment</option>
                <option>Villa</option>
                <option>Commercial</option>
                <option>Land</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">
              Description
            </h2>

            <textarea
              rows={6}
              placeholder="Property description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-4 rounded-lg"
              required
            />
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">
              Amenities
            </h2>

            <input
              type="text"
              placeholder="Pool, Parking, Gym, Balcony"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">
              Property Gallery
            </h2>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setImages(
                  e.target.files
                    ? Array.from(e.target.files)
                    : []
                )
              }
              className="w-full"
            />
          </div>

          {/* Publishing */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">
              Publish Settings
            </h2>

            <div className="flex gap-4 items-center">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-3 rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="hidden">Hidden</option>
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) =>
                    setFeatured(e.target.checked)
                  }
                />
                Featured Listing
              </label>
            </div>
          </div>

          {/* Agent Notes */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">
              Internal Notes
            </h2>

            <textarea
              rows={4}
              placeholder="Private admin notes..."
              value={agentNotes}
              onChange={(e) => setAgentNotes(e.target.value)}
              className="w-full border p-4 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800"
          >
            {loading ? "Publishing..." : "Publish Property"}
          </button>
        </form>
      </div>
    </div>
  );
}