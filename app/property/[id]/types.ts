import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Bed, Bath, Ruler, Phone, MessageCircle, Eye, ArrowLeft } from 'lucide-react';
import { getPropertyById, getSimilarProperties } from '@/lib/supabase/queries';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyCard } from '@/components/property/PropertyCard';
import { formatPrice } from '@/lib/utils';

interface Props {
  params: { id: string }; // Keep as Promise<{ id: string }> if on Next.js 15
}

export default async function PropertyPage({ params }: Props) {
  // Safe extraction for Next.js 13/14 layout structure
  const property = await getPropertyById(params.id);
  if (!property) notFound();
  
  const similar = await getSimilarProperties(property);

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the property: ${property.title} listed on AddisNest. Could you provide more details?`
  );
  // Fallback to default Addis phone formatting if database field is null
  const whatsappUrl = `https://wa.me/${property.agent_whatsapp ?? '251900000000'}?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: gallery + details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Safeguarded with a fallback empty array */}
          <PropertyGallery images={property.images ?? []} title={property.title} />

          {/* Title & Badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                property.listing_type === 'rent' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                For {property.listing_type === 'rent' ? 'Rent' : 'Sale'}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 capitalize">
                {property.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{property.title}</h1>
            <div className="flex items-center gap-1.5 mt-2 text-neutral-500">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>

          {/* Specs Layout */}
          <div className="grid grid-cols-3 gap-4">
            {property.bedrooms !== null && (
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-neutral-100">
                <Bed className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <p className="text-lg font-semibold text-neutral-900">{property.bedrooms}</p>
                <p className="text-xs text-neutral-500">Bedrooms</p>
              </div>
            )}
            {property.bathrooms !== null && (
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-neutral-100">
                <Bath className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <p className="text-lg font-semibold text-neutral-900">{property.bathrooms}</p>
                <p className="text-xs text-neutral-500">Bathrooms</p>
              </div>
            )}
            {property.area !== null && (
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-neutral-100">
                <Ruler className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <p className="text-lg font-semibold text-neutral-900">{property.area}</p>
                <p className="text-xs text-neutral-500">m²</p>
              </div>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
              <h2 className="font-semibold text-neutral-900 mb-3">About this property</h2>
              <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}

          {/* Views tracking display */}
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
            <Eye className="w-3.5 h-3.5" />
            <span>{property.views ?? 0} views</span>
          </div>
        </div>

        {/* Right Sidebar: pricing + CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <p className="text-3xl font-bold text-neutral-900">
                {formatPrice(property.price)}
                {property.listing_type === 'rent' && (
                  <span className="text-base font-normal text-neutral-500">/mo</span>
                )}
              </p>
              <p className="text-sm text-neutral-500 mt-1 capitalize">
                {property.listing_type === 'rent' ? 'Monthly rent' : 'Asking price'}
              </p>

              <div className="mt-6 space-y-3">
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
            </div>

            {/* Agent Info Profile Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 font-bold text-sm">
                    {(property.agent_name ?? 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 text-sm">{property.agent_name ?? 'AddisNest Agent'}</p>
                  <p className="text-xs text-neutral-500">Verified Agent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Listings Carousel/Grid */}
      {similar.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}