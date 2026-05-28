import { Navbar } from "@/components/navbar";
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
      <body className="bg-gray-50 text-gray-900 antialiased">
        {/* Universal Sticky Header Navigation */}
        <Navbar />
        
        {/* Active Page Viewport Content Layout */}
        {children}
      </body>
    </html>
  );
}