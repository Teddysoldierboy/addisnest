import { notFound } from "next/navigation";
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

  if (error || !property) {
    return notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <img
        src={property.image_url || ""}
        className="w-full h-[500px] object-cover rounded-xl"
      />

      <h1 className="text-4xl font-bold mt-6">{property.title}</h1>
      <p className="text-gray-600 mt-2">{property.location}</p>

      <p className="text-3xl font-bold mt-4">
        ETB {property.price?.toLocaleString()}
      </p>

      <p className="mt-8 text-lg">{property.description}</p>
    </div>
  );
}