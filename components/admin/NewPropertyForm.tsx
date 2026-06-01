'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Trash2, Plus } from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { AMENITY_OPTIONS } from '@/lib/constants';

export function NewPropertyForm() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const form = e.currentTarget;
    const data = new FormData(form);
    const validImages = images.filter(Boolean);

    const insert = {
      title: data.get('title') as string,
      description: data.get('description') as string,
      price: Number(data.get('price')),
      location: data.get('location') as string,
      listing_type: data.get('listing_type') as string,
      category: data.get('category') as string,
      bedrooms: data.get('bedrooms') ? Number(data.get('bedrooms')) : null,
      bathrooms: data.get('bathrooms') ? Number(data.get('bathrooms')) : null,
      area: data.get('area') ? Number(data.get('area')) : null,
      status: 'active',
      agent_name: data.get('agent_name') as string || 'AddisNest Agent',
      agent_phone: data.get('agent_phone') as string || null,
      agent_whatsapp: data.get('agent_whatsapp') as string || null,
      is_featured: data.get('is_featured') === 'on',
      images: validImages,
      image_url: validImages[0] ?? null,
      featured_image: validImages[0] ?? null,
      amenities,
      latitude: data.get('latitude') ? Number(data.get('latitude')) : null,
      longitude: data.get('longitude') ? Number(data.get('longitude')) : null,
    };

    const { error } = await supabase.from('properties').insert(insert);
    setSaving(false);
    if (error) {
      setError('Failed to create: ' + error.message);
    } else {
      router.push('/admin/listings');
    }
  }

  return (
    <form onSubmit={handleCreate} className="space-y-6">
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
        <h2 className="font-semibold text-neutral-900">Basic Information</h2>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Title *</label>
          <input name="title" required placeholder="e.g. Modern 3BR Apartment in Bole"
            className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
          <textarea name="description" rows={4} placeholder="Describe the property..."
            className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Price (ETB) *</label>
            <input name="price" type="number" required placeholder="25000"
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Location *</label>
            <input name="location" required placeholder="Bole, Addis Ababa"
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Listing Type</label>
            <select name="listing_type" defaultValue="rent"
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="rent">For Rent</option>
              <option value="buy">For Sale</option>
              <option value="lease">Lease</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
            <select name="category" defaultValue="apartment"
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="office">Office</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Bedrooms</label>
            <input name="bedrooms" type="number" min={0}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Bathrooms</label>
            <input name="bathrooms" type="number" min={0}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Area (m²)</label>
            <input name="area" type="number" min={0}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
        <h2 className="font-semibold text-neutral-900">Images</h2>
        <ImageUploadField
          aspectMode="4:3"
          onUploaded={(url) => setImages((prev) => [...prev.filter(Boolean), url])}
        />
        {images.map((img, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 w-4">{i + 1}</span>
            <input
              value={img}
              onChange={(e) => setImages((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
              placeholder="https://..."
              className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
              className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setImages((prev) => [...prev, ''])}
          className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add image URL manually
        </button>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-3">
        <h2 className="font-semibold text-neutral-900">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((tag) => {
            const active = amenities.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setAmenities((prev) =>
                    active ? prev.filter((a) => a !== tag) : [...prev, tag]
                  )
                }
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-amber-300'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
        <h2 className="font-semibold text-neutral-900">Map coordinates (optional)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Latitude</label>
            <input name="latitude" type="number" step="any" placeholder="8.99"
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Longitude</label>
            <input name="longitude" type="number" step="any" placeholder="38.78"
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
        <h2 className="font-semibold text-neutral-900">Agent / Contact</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Agent Name</label>
            <input name="agent_name" placeholder="AddisNest Agent"
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
            <input name="agent_phone" placeholder="+251..."
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">WhatsApp</label>
            <input name="agent_whatsapp" placeholder="251..."
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="is_featured" id="is_featured_new" className="w-4 h-4 accent-amber-500" />
          <label htmlFor="is_featured_new" className="text-sm font-medium text-neutral-700">Mark as Featured</label>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
          {saving ? 'Creating...' : 'Create Listing'}
        </button>
        <button type="button" onClick={() => router.push('/admin/listings')}
          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
          Cancel
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </form>
  );
}