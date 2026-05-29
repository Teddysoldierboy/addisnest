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

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) return notFound();

  const whatsappMessage = encodeURIComponent(
    `Hello AddisNest, I'm interested in "${property.title}" located in ${property.location}. Is it still available?`
  );

  const defaultAgentPhone = "+251911234567";

  const gallery =
    property.gallery?.length > 0
      ? property.gallery
      : property.image_url
      ? [property.image_url]
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAV */}
      <div className="bg-white border-b sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-black"
          >
            ← Back to Listings
          </Link>

          <span className="text-sm font-semibold">
            AddisNest
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* HERO GALLERY */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 h-[520px] rounded-3xl overflow-hidden shadow-sm">
            {gallery[0] ? (
              <img
                src={gallery[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-200 text-gray-500">
                No Image
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {gallery.slice(1, 5).map((img: string, i: number) => (
              <div
                key={i}
                className="h-40 rounded-2xl overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Gallery ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* TITLE */}
        <div className="bg-white rounded-3xl border p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">
                {property.category || "Property"}
              </span>

              <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
                {property.title}
              </h1>

              <p className="text-gray-500 mt-3 text-lg">
                📍 {property.location || "Addis Ababa"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Price
              </p>

              <p className="text-4xl font-extrabold mt-2">
                {property.price
                  ? `${Number(property.price).toLocaleString()} ETB`
                  : "Contact"}
              </p>

              <span
                className={`inline-block mt-4 px-5 py-2 rounded-xl text-white font-semibold ${
                  property.listing_type === "rent"
                    ? "bg-blue-600"
                    : "bg-green-600"
                }`}
              >
                For {property.listing_type || "Sale"}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Bedrooms" value={property.bedrooms || 0} icon="🛏️" />
              <StatCard label="Bathrooms" value={property.bathrooms || 0} icon="🛁" />
              <StatCard label="Area" value={`${property.area || 0} sqm`} icon="📐" />
              <StatCard label="Type" value={property.category} icon="🏠" />
            </div>

            {/* DESCRIPTION */}
            <section className="bg-white rounded-3xl border p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-5">
                About this Property
              </h2>

              <p className="text-gray-700 leading-8 whitespace-pre-line">
                {property.description ||
                  "No description available for this listing."}
              </p>
            </section>

            {/* AMENITIES */}
            {property.amenities?.length > 0 && (
              <section className="bg-white rounded-3xl border p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-5">
                  Amenities
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {property.amenities.map(
                    (item: string, i: number) => (
                      <div
                        key={i}
                        className="bg-gray-50 p-4 rounded-xl flex items-center gap-3"
                      >
                        ✓ {item}
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div className="bg-white rounded-3xl border p-8 shadow-sm sticky top-24">
              <h3 className="text-2xl font-bold mb-4">
                Contact Agent
              </h3>

              <p className="text-gray-500 mb-6">
                Schedule a viewing or request more details.
              </p>

              <div className="space-y-4">
                <a
                  href={`tel:${defaultAgentPhone}`}
                  className="block w-full text-center bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800"
                >
                  📞 Call Agent
                </a>

                <a
                  href={`https://wa.me/${defaultAgentPhone.replace(
                    "+",
                    ""
                  )}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-green-600 text-white py-4 rounded-2xl font-semibold hover:bg-green-700"
                >
                  💬 WhatsApp
                </a>
              </div>

              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-gray-500">
                  Verified by AddisNest
                </p>
                <p className="font-semibold mt-1">
                  Professional Property Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <p className="text-2xl">{icon}</p>
      <p className="text-sm text-gray-500 mt-2">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}