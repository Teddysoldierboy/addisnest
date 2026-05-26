"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [listingType, setListingType] = useState("buy");
  const [description, setDescription] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const addProperty = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an image");
      return;
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(fileName, file);

    if (uploadError) {
      setMessage(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    const { error } = await supabase.from("properties").insert({
      title,
      location,
      price: Number(price),
      listing_type: listingType,
      description,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      image_url: imageUrl,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Property added successfully!");

    setTitle("");
    setLocation("");
    setPrice("");
    setListingType("buy");
    setDescription("");
    setBedrooms("");
    setBathrooms("");
    setArea("");
    setFile(null);
  };

  return (
    <main className="min-h-screen max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Upload</h1>

      <form onSubmit={addProperty} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-3 rounded"
          required
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full border p-3 rounded"
          required
        />

        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          placeholder="Bedrooms"
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          placeholder="Bathrooms"
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Area (sqm)"
          className="w-full border p-3 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border p-3 rounded"
          required
        />

        <button className="w-full bg-black text-white p-3 rounded">
          Add Property
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}