'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Trash2, Plus } from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { AMENITY_OPTIONS } from '@/lib/constants';
import type { Property } from '@/lib/types';

interface Props {
  property: Property;
}

export function PropertyEditForm({ property }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState<string[]>(
    property.images?.length ? property.images : property.image_url ? [property.image_url] : ['']
  );
  const [uploading, setUploading] = useState(false);
  const [amenities, setAmenities] = useState<string[]>(property.amenities ?? []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const form = e.currentTarget;
    const data = new FormData(form);

    const validImages = images.filter(Boolean);

    const update = {
      title: data.get('title') as string,
      description: data.get('description') as string,
      price: Number(data.get('price')),
      location: data.get('location') as string,
      listing_type: data.get('listing_type') as string,
      category: data.get('category') as string,
      bedrooms: data.get('bedrooms') ? Number(data.get('bedrooms')) : null,
      bathrooms: data.get('bathrooms') ? Number(data.get('bathrooms')) : null,
      area: data.get('area') ? Number(data.get('area')) : null,
      status: data.get('status') as string,
      agent_name: data.get('agent_name') as string,
      agent_phone: data.get('agent_phone') as string,
      agent_whatsapp: data.get('agent_whatsapp') as string,
      is_featured: data.get('is_featured') === 'on',
      images: validImages,
      image_url: validImages[0] ?? null,
      featured_image: validImages[0] ?? null,
      amenities,
      latitude: data.get('latitude') ? Number(data.get('latitude')) : property.latitude ?? null,
      longitude: data.get('longitude') ? Number(data.get('longitude')) : property.longitude ?? null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('properties')
      .update(update)
      .eq('id', property.id);

    setSaving(false);
    if (error) {
      setError('Failed to save: ' + error.message);
    } else {
      setSuccess('Saved successfully!');
      setTimeout(() => router.push('/admin/listings'), 1000);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);

    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const path = `${property.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from('property-images')
        .upload(path, file, { upsert: false });

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(path);
        uploaded.push(publicUrl);
      }
    }

    setImages(prev => [...prev.filter(Boolean), ...uploaded]);
    setUploading(false);
  }

  async function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  function updateImageUrl(index: number, value: string) {
    setImages(prev => prev.map((img, i) => i === index ? value : img));
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Basic Info */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
        <h2 className="font-semibold text-neutral-900">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Title *</label>
          <input name="title" defaultValue={property.title} required
            className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
          <textarea name="description" defaultValue={property.description ?? ''} rows={5}
            className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Price (ETB) *</label>
            <input name="price" type="number" defaultValue={property.price} required
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Location *</label>
            <input name="location" defaultValue={property.location} required
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Listing Type</label>
            <select name="listing_type" defaultValue={property.listing_type}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="rent">For Rent</option>
              <option value="buy">For Sale</option>
              <option value="lease">Lease</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
            <select name="category" defaultValue={property.category}
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
      </section>

      {/* Specs */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
        <h2 className="font-semibold text-neutral-900">Property Specs</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Bedrooms</label>
            <input name="bedrooms" type="number" min={0} defaultValue={property.bedrooms ?? ''}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Bathrooms</label>
            <input name="bathrooms" type="number" min={0} defaultValue={property.bathrooms ?? ''}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Area (m²)</label>
            <input name="area" type="number" min={0} defaultValue={property.area ?? ''}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
        <h2 className="font-semibold text-neutral-900">Images</h2>
        <ImageUploadField
          storagePrefix={property.id}
          aspectMode="4:3"
          onUploaded={(url) => setImages((prev) => [...prev.filter(Boolean), url])}
        />
        <label className="cursor-pointer text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-3 py-1.5 rounded-lg transition-colors inline-block">
          {uploading ? 'Uploading raw files…' : '↑ Upload without crop (legacy)'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
        </label>
        <p className="text-xs text-neutral-400">First image is the cover. Prefer crop upload for consistent 4:3 marketing shots.</p>

        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 w-4">{i + 1}</span>
              <input
                value={img}
                onChange={e => updateImageUrl(i, e.target.value)}
                placeholder="https://..."
                className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button type="button" onClick={() => removeImage(i)}
                className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-lg transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setImages(prev => [...prev, ''])}
          className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add image URL
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
        <h2 className="font-semibold text-neutral-900">Map coordinates</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Latitude</label>
            <input name="latitude" type="number" step="any" defaultValue={property.latitude ?? ''}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Longitude</label>
            <input name="longitude" type="number" step="any" defaultValue={property.longitude ?? ''}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
      </section>

      {/* Agent Info */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
        <h2 className="font-semibold text-neutral-900">Agent / Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Agent Name</label>
            <input name="agent_name" defaultValue={property.agent_name ?? 'AddisNest Agent'}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
            <input name="agent_phone" defaultValue={property.agent_phone ?? ''}
              placeholder="+251..."
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">WhatsApp</label>
            <input name="agent_whatsapp" defaultValue={property.agent_whatsapp ?? ''}
              placeholder="251..."
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
      </section>

      {/* Status & Visibility */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
        <h2 className="font-semibold text-neutral-900">Status & Visibility</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
            <select name="status" defaultValue={property.status}
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="active">Active (Visible)</option>
              <option value="hidden">Hidden</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" name="is_featured" id="is_featured"
              defaultChecked={property.is_featured}
              className="w-4 h-4 accent-amber-500" />
            <label htmlFor="is_featured" className="text-sm font-medium text-neutral-700">Mark as Featured</label>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.push('/admin/listings')}
          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
          Cancel
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-emerald-600 text-sm">{success}</p>}
      </div>
    </form>
  );
}
