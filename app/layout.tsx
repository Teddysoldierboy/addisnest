import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "AddisNest | Real Estate Marketplace",
  description: "Premium property listings platform in Addis Ababa, Ethiopia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Unified background with neutral system */}
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        
        {/* Direct Global Navigation Header - Bypasses all import bugs */}
        <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md">
          {/* Max-width matched to max-w-7xl so header and page content align perfectly */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-black text-neutral-900 tracking-tight">
                AddisNest<span className="text-blue-600">.</span>
              </span>
            </Link>

            {/* Menu Links */}
            <nav className="flex items-center gap-2 md:gap-4">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100/50 transition-colors"
              >
                Marketplace
              </Link>

              <Link
                href="/admin/listings"
                className="px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100/50 transition-colors"
              >
                Manage Listings
              </Link>

              <Link
                href="/admin"
                className="ml-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm transition-all"
              >
                + Add Property
              </Link>
            </nav>

          </div>
        </header>

        {/* Dynamic page content switchboard viewport */}
        {children}
        
      </body>
    </html>
  );
}