"use client";

export function HeroSection({ mode, setMode }: any) {
  return (
    <section className="py-20 text-center bg-gray-100">
      <h1 className="text-5xl font-bold mb-8">
        Find Your Perfect Property in Addis Ababa
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setMode("buy")}
          className={`px-6 py-3 rounded-full ${
            mode === "buy"
              ? "bg-black text-white"
              : "bg-white border"
          }`}
        >
          Buy
        </button>

        <button
          onClick={() => setMode("rent")}
          className={`px-6 py-3 rounded-full ${
            mode === "rent"
              ? "bg-black text-white"
              : "bg-white border"
          }`}
        >
          Rent
        </button>
      </div>
    </section>
  );
}