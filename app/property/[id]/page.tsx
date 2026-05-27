import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return notFound();

  // Fetch from the correct "properties" table
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    return notFound();
  }

  // Pre-fill a WhatsApp text message template with the specific property details
  const whatsappMessage = encodeURIComponent(
    `Hello AddisNest, I am interested in your listing: "${property.title}" in ${property.location || "Addis Ababa"}. Is it still available?`
  );
  const defaultAgentPhone = "+251911234567"; // Replace this placeholder with your actual business line later

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Back to Discovery Navigation */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="text-sm font-medium text-gray-500 hover:text-black transition-colors inline-flex items-center gap-2"
        >
          ← Back to Marketplace
        </Link>
      </div>

      {/* Main Image Showcase with Floating Context Badge */}
      <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-gray-50">
        {property.image_url ? (
          <img
            src={property.image_url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
            <span className="text-4xl mb-2">🏢</span>
            <span className="text-sm font-medium">No Image Provided</span>
          </div>
        )}
        
        {/* Absolute-Positioned Buy/Rent Indicator Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md text-white ${
            property.listing_type === 'rent' ? 'bg-blue-600' : 'bg-green-600'
          }`}>
            For {property.listing_type || 'Sale'}
          </span>
        </div>
      </div>

      {/* Hero Header Presentation */}
      <div className="mt-8 border-b border-gray-100 pb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md mb-2">
              {property.category || "Property"}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {property.title}
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-1.5 text-sm md:text-base">
              📍 {property.location || "Addis Ababa, Ethiopia"}
            </p>
          </div>
          
          <div className="md:text-right">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Price</p>
            <p className="text-3xl font-extrabold text-black mt-0.5">
              {property.price ? `${Number(property.price).toLocaleString()} ETB` : "Contact for Price"}
            </p>
          </div>
        </div>
      </div>

      {/* Premium Specifications Grid Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-gray-100">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase">Bedrooms</p>
          <p className="text-lg font-bold text-gray-900 mt-1 flex items-center gap-2">
            🛏️ {property.bedrooms || 0} Rooms
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase">Bathrooms</p>
          <p className="text-lg font-bold text-gray-900 mt-1 flex items-center gap-2">
            🛁 {property.bathrooms || 0} Baths
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase">Total Area</p>
          <p className="text-lg font-bold text-gray-900 mt-1 flex items-center gap-1">
            📐 {property.area || 0} <span className="text-sm font-medium text-gray-500">sqm</span>
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase">Listing Context</p>
          <p className="text-lg font-bold text-gray-900 mt-1 flex items-center gap-2 capitalize">
            🔑 Immediate {property.listing_type || "Buy"}
          </p>
        </div>
      </div>

      {/* Structured Content Shell & Action Block Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Core Narrative Text Section */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About this space</h2>
          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
            {property.description || "No specific metadata description provided for this listing."}
          </p>
        </div>

        {/* Call To Action Agent Engagement Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Interested in this property?</h3>
          <p className="text-xs text-gray-500 leading-normal">
            Connect directly with an authorized AddisNest real estate agent to gather details, verify layouts, or organize an on-site visit in Addis Ababa.
          </p>
          
          <div className="space-y-2 pt-2">
            {/* Direct Cellular Phone Protocol Link */}
            <a 
              href={`tel:${defaultAgentPhone}`}
              className="block w-full text-center bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm"
            >
              📞 Call Agent
            </a>

            {/* Direct WhatsApp Message Link with Pre-filled Context Text */}
            <a 
              href={`https://wa.me/${defaultAgentPhone.replace('+', '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center border border-green-500 text-green-600 bg-green-50/20 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors"
            >
              💬 WhatsApp Inquiry
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}