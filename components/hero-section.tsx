"use client";

import { Home, Key } from "lucide-react";

interface HeroSectionProps {
  mode: "buy" | "rent";
  setMode: (mode: "buy" | "rent") => void;
}

export function HeroSection({ mode, setMode }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-radial from-neutral-50 via-neutral-100 to-neutral-200/70 py-24 px-4 border-b border-neutral-200/60">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[10%] w-[300px] h-[300px] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-neutral-400/20 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
        <span className="text-[11px] font-bold tracking-widest uppercase text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full mb-4">
          Welcome to AddisNest Real Estate
        </span>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-[1.1] mb-6 max-w-3xl">
          Find Your Perfect Property in <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">Addis Ababa</span>
        </h1>
        
        <p className="text-neutral-500 max-w-xl text-base sm:text-lg mb-10 leading-relaxed font-medium">
          Discover premium apartments, modern family villas, and commercial spaces tailored entirely to your lifestyle.
        </p>

        {/* Premium Mode Switcher */}
        <div className="inline-flex p-1.5 bg-white border border-neutral-200 shadow-sm rounded-2xl gap-1 z-10">
          <button
            onClick={() => setMode("buy")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              mode === "buy"
                ? "bg-neutral-950 text-white shadow-sm scale-[1.02]"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <Home className={`w-4 h-4 ${mode === "buy" ? "text-amber-400" : "text-neutral-400"}`} />
            Buy Properties
          </button>

          <button
            onClick={() => setMode("rent")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              mode === "rent"
                ? "bg-neutral-950 text-white shadow-sm scale-[1.02]"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <Key className={`w-4 h-4 ${mode === "rent" ? "text-amber-400" : "text-neutral-400"}`} />
            Rent Spaces
          </button>
        </div>
      </div>
    </section>
  );
}