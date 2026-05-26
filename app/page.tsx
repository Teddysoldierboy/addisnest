"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import FeaturedProperties from "@/components/featured-properties";
import { PopularAreas } from "@/components/popular-areas";
import { WhyChooseUs } from "@/components/why-choose-us";
import { VerifiedListings } from "@/components/verified-listings";
import { CompareProjects } from "@/components/compare-projects";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const [mode, setMode] = useState("buy");

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection mode={mode} setMode={setMode} />
      <FeaturedProperties mode={mode} />
      <PopularAreas />
      <WhyChooseUs />
      <VerifiedListings />
      <CompareProjects />
      <Footer />
    </main>
  );
}