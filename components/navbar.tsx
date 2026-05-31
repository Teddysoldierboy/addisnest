"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Plus } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  // Unified routing match helper
  const isActive = (path: string) => pathname === path;
  const isAdminActive = pathname?.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/60 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo Identity */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center group-hover:bg-neutral-800 transition-colors">
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xl font-black text-neutral-900 tracking-tight transition-colors">
            AddisNest<span className="text-amber-500">.</span>
          </span>
        </Link>

        {/* Navigation Action Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all ${
              isActive("/") 
                ? "text-neutral-900 bg-neutral-100" 
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            Marketplace
          </Link>

          <Link
            href="/admin/listings"
            className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all ${
              pathname?.startsWith("/admin/listings")
                ? "text-neutral-900 bg-neutral-100" 
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            Manage Listings
          </Link>

          {/* Premium Call to Action Shortcut Button */}
          <Link
            href="/admin"
            className={`ml-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-1.5 shadow-xs border ${
              isAdminActive && !pathname.startsWith("/admin/listings")
                ? "bg-amber-500 text-neutral-950 border-amber-600 font-extrabold"
                : "bg-neutral-950 text-white border-neutral-950 hover:bg-neutral-800 hover:border-neutral-800"
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            Add Property
          </Link>
        </nav>

      </div>
    </header>
  );
}