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
const [status, setStatus] = useState("live");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, image);

      if (uploadError) {
        alert("Image upload failed");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("properties").insert([
  {
    title,
    location,
    price,
    listing_type: type,
    category,
    bedrooms,
    bathrooms,
    area,
    featured,
    status,
    description,
    image_url
  }
]);

    if (error) {
      alert("Failed to add property");
    } else {
      alert("Property added successfully");

      setTitle("");
      setLocation("");
      setPrice("");
      setType("buy");
      setDescription("");
      setImage(null);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex gap-4 mb-8">
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

      <h1 className="text-3xl font-bold mb-8">Add Property</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Property Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          <textarea
  placeholder="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="w-full p-3 border rounded mb-4"
 />

<input
  type="number"
  placeholder="Bedrooms"
  value={bedrooms}
  onChange={(e) => setBedrooms(e.target.value)}
  className="w-full p-3 border rounded mb-4"
/>

<input
  type="number"
  placeholder="Bathrooms"
  value={bathrooms}
  onChange={(e) => setBathrooms(e.target.value)}
  className="w-full p-3 border rounded mb-4"
/>

<input
  type="number"
  placeholder="Square Meters"
  value={sqm}
  onChange={(e) => setSqm(e.target.value)}
  className="w-full p-3 border rounded mb-4"
/>
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-3 rounded-lg"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded-lg"
          rows={5}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files ? e.target.files[0] : null)
          }
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Uploading..." : "Add Property"}
        </button>
      </form>
    </div>
  );
}