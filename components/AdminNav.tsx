import Link from "next/link";

export default function AdminNav() {
  return (
    <nav className="flex gap-4 p-4 bg-black text-white">
      <Link href="/admin">Add Property</Link>
      <Link href="/admin/listings">Listings</Link>
      <Link href="/admin/dashboard">Dashboard</Link>
    </nav>
  );
}