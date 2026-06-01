'use client';

import { useState } from 'react';
import { Calendar, Phone, MessageCircle } from 'lucide-react';
import type { Property } from '@/lib/types';
import { LeadCaptureModal } from '@/components/property/LeadCaptureModal';

interface PropertyDetailActionsProps {
  property: Property;
  whatsappUrl: string;
}

export function PropertyDetailActions({ property, whatsappUrl }: PropertyDetailActionsProps) {
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => setLeadOpen(true)}
          className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Schedule tour / Call owner
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp Agent
        </a>

        {property.agent_phone && (
          <a
            href={`tel:${property.agent_phone}`}
            className="flex items-center justify-center gap-2 w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Agent
          </a>
        )}
      </div>

      <LeadCaptureModal property={property} open={leadOpen} onClose={() => setLeadOpen(false)} />
    </>
  );
}
