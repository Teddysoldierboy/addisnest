import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { popularAreas } from "@/lib/data"

export function PopularAreas() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Popular Areas in Addis Ababa
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the most sought-after neighborhoods with the best amenities and investment potential.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularAreas.map((area) => (
            <div
              key={area.name}
              className="group relative rounded-xl overflow-hidden cursor-pointer"
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src={area.image}
                  alt={area.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {area.name}
                </h3>
                <p className="text-white/80 text-sm mb-2">{area.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-sm font-medium">
                    {area.properties} Properties
                  </span>
                  <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
