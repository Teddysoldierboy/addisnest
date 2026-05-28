import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar"; // Import the header
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
      <body className={`${inter.className} bg-gray-50 text-gray-900 smooth-antialiasing`}>
        {/* Render the premium header navigation layout component universally */}
        <Navbar />
        
        {/* Render the individual subpage views */}
        {children}
      </body>
    </html>
  );
}