import { Scale, ArrowRight, Check, MapPin, Bed, Bath } from "lucide-react";

export function CompareProjects() {
  return (
    <section className="py-20 bg-neutral-100/60 border-y border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Visual Showcase Left Column */}
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              
              {/* Mock Property Card 1 */}
              <div className="aspect-[4/5] rounded-2xl bg-white border border-neutral-200/60 p-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-full aspect-video bg-neutral-900 rounded-xl mb-3 relative flex items-center justify-center overflow-hidden">
                    <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Bole Luxury Apt</span>
                  </div>
                  <h4 className="font-bold text-neutral-900 text-sm truncate">Premium 3-BR Apartment</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span className="text-xs text-neutral-500 truncate">Bole, Addis Ababa</span>
                  </div>
                  <div className="flex gap-2 mt-3 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" /> 3 bd</span>
                    <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" /> 2 ba</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 mt-2">ETB 14.5M</p>
                  <div className="h-8 w-full bg-amber-500/10 text-amber-700 font-medium text-xs rounded-xl flex items-center justify-center mt-2">
                    Selected
                  </div>
                </div>
              </div>

              {/* Mock Property Card 2 (Offset to give a dynamic layout) */}
              <div className="aspect-[4/5] rounded-2xl bg-white border border-neutral-200/60 p-4 flex flex-col justify-between shadow-xs mt-8">
                <div>
                  <div className="w-full aspect-video bg-neutral-800 rounded-xl mb-3 relative flex items-center justify-center overflow-hidden">
                    <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">CMC Modern Villa</span>
                  </div>
                  <h4 className="font-bold text-neutral-900 text-sm truncate">Contemporary Family Villa</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span className="text-xs text-neutral-500 truncate">CMC, Addis Ababa</span>
                  </div>
                  <div className="flex gap-2 mt-3 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" /> 4 bd</span>
                    <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" /> 3.5 ba</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 mt-2">ETB 38.0M</p>
                  <div className="h-8 w-full bg-amber-500/10 text-amber-700 font-medium text-xs rounded-xl flex items-center justify-center mt-2">
                    Selected
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Copy Description Right Column */}
          <div className="order-1 lg:order-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
              <Scale className="h-6 w-6 text-amber-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4 tracking-tight">
              Compare Properties Side by Side
            </h2>
            <p className="text-neutral-500 text-base mb-6 leading-relaxed">
              Make informed decisions by comparing multiple properties simultaneously. View prices, features, amenities, and locations side-by-side in one clear grid view.
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {[
                "Compare up to 4 premium properties at once",
                "Side-by-side spec metric comparison breakdown",
                "Value analytics relative to local market neighborhoods",
                "Save dynamic configurations for later review",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-700 font-medium">
                  <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Start comparing
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}