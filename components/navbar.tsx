"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  // Helper function to highlight the active tab dynamically
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo Identity */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-black text-gray-900 tracking-tight group-hover:text-gray-700 transition-colors">
            AddisNest<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* Navigation Action Links Links */}
        <nav className="flex items-center gap-1 md:gap-4">
          <Link
            href="/"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive("/") 
                ? "text-black bg-gray-50 font-semibold" 
                : "text-gray-500 hover:text-black hover:bg-gray-50/50"
            }`}
          >
            Marketplace
          </Link>

          <Link
            href="/admin/listings"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              pathname.startsWith("/admin/listings")
                ? "text-black bg-gray-50 font-semibold" 
                : "text-gray-500 hover:text-black hover:bg-gray-50/50"
            }`}
          >
            Manage Listings
          </Link>

          {/* Premium Call to Action Shortcut Button */}
          <Link
            href="/admin"
            className={`ml-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              isActive("/admin")
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-black text-white hover:bg-gray-800 shadow-xs hover:shadow-md"
            }`}
          >
            + Add Property
          </Link>
        </nav>

      </div>
    </header>
  );
}