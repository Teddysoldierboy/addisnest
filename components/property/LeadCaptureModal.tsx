'use client';

import { useState } from 'react';
import { Calendar, Phone, User, X } from 'lucide-react';
import type { Property } from '@/lib/types';

interface LeadCaptureModalProps {
  property: Pick<Property, 'id' | 'title'>;
  open: boolean;
  onClose: () => void;
}

export function LeadCaptureModal({ property, open, onClose }: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: property.id,
        name,
        phone,
        tour_date: tourDate || null,
        message: message || null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(typeof data.error === 'string' ? data.error : 'Could not submit your request.');
      return;
    }

    setSuccess(true);
    setName('');
    setPhone('');
    setTourDate('');
    setMessage('');
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between px-5 py-4 border-b border-neutral-100">
          <div>
            <h3 className="font-semibold text-neutral-900">Schedule a tour</h3>
            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{property.title}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100">
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <p className="text-emerald-600 font-semibold">Request received!</p>
            <p className="text-sm text-neutral-500 mt-2">An agent will contact you shortly.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Full name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Phone number
              </label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251..."
                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Preferred tour date
              </label>
              <input
                type="date"
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1">Message (optional)</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm"
            >
              {loading ? 'Submitting…' : 'Request tour / call back'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
