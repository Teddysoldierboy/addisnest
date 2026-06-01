"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  LayoutDashboard, Building2, Plus, Star, LogOut,
  Eye, EyeOff, Trash2, Pencil, Upload, X, ChevronDown
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  image_url: string | null;
  listing_type: string;
  category: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  status: string;
  is_featured: boolean;
  views: number;
  created_at: string;
}

const AMENITY_LIST = [
  "Parking", "Security", "Generator", "Pool",
  "Gym", "Garden", "Elevator", "Balcony", "CCTV", "Internet", "Furnished",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(p: number) {
  if (p >= 1_000_000) return `ETB ${(p / 1_000_000).toFixed(1)}M`;
  if (p >= 1_000) return `ETB ${(p / 1_000).toFixed(0)}K`;
  return `ETB ${p.toLocaleString()}`;
}
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "1 day ago";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [view, setView] = useState<"dashboard" | "listings" | "add">("dashboard");

  // Check auth on mount
  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/admin/login");
      else { setAuthed(true); setChecking(false); }
    });
  }, [router]);

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <p className="text-neutral-400 text-sm">Checking session...</p>
    </div>
  );
  if (!authed) return null;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar view={view} setView={setView} />
      <div className="flex-1 min-w-0">
        {view === "dashboard" && <DashboardView setView={setView} />}
        {view === "listings" && <ListingsView />}
        {view === "add" && <AddPropertyView onSuccess={() => setView("listings")} />}
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ view, setView }: { view: string; setView: (v: any) => void }) {
  async function signOut() {
    await createClient().auth.signOut();
    window.location.href = "/admin/login";
  }
  const navItem = (id: string, icon: React.ReactNode, label: string) => (
    <button
      key={id}
      onClick={() => setView(id)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
        view === id
          ? "bg-white text-neutral-900 border border-neutral-200 shadow-sm"
          : "text-neutral-500 hover:bg-white hover:text-neutral-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <aside className="w-52 flex-shrink-0 bg-neutral-100 border-r border-neutral-200 flex flex-col min-h-screen">
      <div className="px-4 py-4 border-b border-neutral-200">
        <span className="font-bold text-neutral-900">
          AddisNest<span className="text-amber-500">.</span>
        </span>
        <p className="text-xs text-neutral-400 mt-0.5">Admin Panel</p>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        <p className="text-xs text-neutral-400 px-2 pt-3 pb-1 uppercase tracking-wide">Overview</p>
        {navItem("dashboard", <LayoutDashboard className="w-4 h-4" />, "Dashboard")}
        {navItem("listings", <Building2 className="w-4 h-4" />, "All Listings")}
        <p className="text-xs text-neutral-400 px-2 pt-3 pb-1 uppercase tracking-wide">Manage</p>
        {navItem("add", <Plus className="w-4 h-4" />, "Add Property")}
        {navItem("featured", <Star className="w-4 h-4" />, "Featured")}
      </nav>
      <div className="p-2 border-t border-neutral-200">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-neutral-500 hover:bg-white hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}

// ── Dashboard View ─────────────────────────────────────────────────────────────
function DashboardView({ setView }: { setView: (v: any) => void }) {
  const [stats, setStats] = useState({ total: 0, active: 0, closed: 0, hidden: 0 });
  const [recent, setRecent] = useState<Property[]>([]);

  useEffect(() => {
    createClient().from("properties").select("status").then(({ data }) => {
      const all = data ?? [];
      setStats({
        total: all.length,
        active: all.filter(p => p.status === "active").length,
        closed: all.filter(p => ["sold", "rented"].includes(p.status)).length,
        hidden: all.filter(p => ["hidden", "draft"].includes(p.status)).length,
      });
    });
    createClient().from("properties").select("*")
      .order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => setRecent(data ?? []));
  }, []);

  const statCards = [
    { label: "Total listings", value: stats.total, color: "text-neutral-900" },
    { label: "Active", value: stats.active, color: "text-green-600" },
    { label: "Rented / Sold", value: stats.closed, color: "text-amber-500" },
    { label: "Hidden / Draft", value: stats.hidden, color: "text-neutral-400" },
  ];

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Welcome back — here's what's happening</p>
        </div>
        <button
          onClick={() => setView("add")}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add property
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statCards.map(s => (
          <div key={s.label} className="bg-neutral-100 rounded-xl p-4">
            <p className="text-xs text-neutral-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent listings */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900 text-sm">Recent listings</h2>
          <button onClick={() => setView("listings")} className="text-xs text-amber-600 hover:underline">View all →</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Property</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-neutral-400">Price</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-neutral-400">Status</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-neutral-400">Added</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr><td colSpan={4} className="text-center py-10 text-neutral-300 text-sm">No listings yet</td></tr>
            )}
            {recent.map(p => (
              <tr key={p.id} className="border-t border-neutral-50 hover:bg-neutral-50">
                <td className="px-5 py-3 font-medium text-neutral-800 truncate max-w-[200px]">{p.title}</td>
                <td className="px-3 py-3 text-neutral-600">{formatPrice(p.price)}</td>
                <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-3 py-3 text-neutral-400 text-xs">{timeAgo(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Listings View ──────────────────────────────────────────────────────────────
function ListingsView() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await createClient().from("properties").select("*").order("created_at", { ascending: false });
    setProperties(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleVisibility(p: Property) {
    const next = p.status === "active" ? "hidden" : "active";
    await createClient().from("properties").update({ status: next }).eq("id", p.id);
    load();
  }

  async function deleteProperty(id: string) {
    if (!confirm("Delete this listing permanently?")) return;
    await createClient().from("properties").delete().eq("id", id);
    load();
  }

  const filtered = properties.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchType = typeFilter === "all" || p.listing_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-neutral-900">All Listings ({filtered.length})</h1>
        <Link href="/admin/listings/new" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add new
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search listings..."
          className="flex-1 min-w-48 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
          <option value="draft">Draft</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-neutral-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none">
          <option value="all">All types</option>
          <option value="buy">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="lease">Lease</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400">Property</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-neutral-400">Price</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-neutral-400">Type</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-neutral-400">Status</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-neutral-400">Views</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-neutral-400">Added</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="text-center py-12 text-neutral-300 text-sm">Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-neutral-300 text-sm">No listings found</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-neutral-800 truncate max-w-[220px]">{p.title}</p>
                      <p className="text-xs text-neutral-400">{p.location}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-semibold text-neutral-900">
                    {formatPrice(p.price)}
                    {p.listing_type === "rent" && <span className="text-xs font-normal text-neutral-400">/mo</span>}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      p.listing_type === "rent" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {p.listing_type === "rent" ? "Rent" : "Sale"}
                    </span>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-3 py-3 text-neutral-500 text-xs">{p.views ?? 0}</td>
                  <td className="px-3 py-3 text-neutral-400 text-xs">{timeAgo(p.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/listings/${p.id}/edit`}
                        className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => toggleVisibility(p)}
                        className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                        title={p.status === "active" ? "Hide listing" : "Make visible"}
                      >
                        {p.status === "active" ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Add Property Form ──────────────────────────────────────────────────────────
function AddPropertyView({ onSuccess }: { onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  function toggleAmenity(name: string) {
    setAmenities(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await createClient().storage.from("property-images").upload(path, file);
      if (!error) {
        const { data: { publicUrl } } = createClient().storage.from("property-images").getPublicUrl(path);
        uploaded.push(publicUrl);
      }
    }
    setImages(prev => [...prev.filter(Boolean), ...uploaded]);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const validImages = images.filter(Boolean);

    const { error } = await createClient().from("properties").insert({
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      price: Number(fd.get("price")),
      location: fd.get("location") as string,
      listing_type: fd.get("listing_type") as string,
      category: fd.get("category") as string,
      bedrooms: fd.get("bedrooms") ? Number(fd.get("bedrooms")) : null,
      bathrooms: fd.get("bathrooms") ? Number(fd.get("bathrooms")) : null,
      area: fd.get("area") ? Number(fd.get("area")) : null,
      status: fd.get("status") as string,
      is_featured: fd.get("is_featured") === "on",
      agent_name: fd.get("agent_name") as string || "AddisNest Agent",
      agent_phone: fd.get("agent_phone") as string || null,
      agent_whatsapp: fd.get("agent_whatsapp") as string || null,
      images: validImages,
      image_url: validImages[0] ?? null,
      amenities,
    });

    setSaving(false);
    if (error) setError("Save failed: " + error.message);
    else onSuccess();
  }

  const inputClass = "w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300";
  const labelClass = "block text-xs font-medium text-neutral-500 mb-1";

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-bold text-neutral-900 mb-6">Add new property</h1>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic Info */}
        <section className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-4">
          <h2 className="font-semibold text-neutral-800 text-sm">Basic information</h2>
          <div>
            <label className={labelClass}>Property title *</label>
            <input name="title" required placeholder="e.g. Modern 3BR Apartment in Bole" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Listing type</label>
              <select name="listing_type" defaultValue="rent" className={inputClass}>
                <option value="rent">For Rent</option>
                <option value="buy">For Sale</option>
                <option value="lease">Lease</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select name="category" defaultValue="apartment" className={inputClass}>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="office">Office</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Price (ETB) *</label>
              <input name="price" type="number" required placeholder="25000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location *</label>
              <input name="location" required placeholder="Bole, Addis Ababa" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" rows={4} placeholder="Describe the property..." className={inputClass} />
          </div>
        </section>

        {/* Specs */}
        <section className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-4">
          <h2 className="font-semibold text-neutral-800 text-sm">Property specs</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Bedrooms</label>
              <input name="bedrooms" type="number" min={0} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bathrooms</label>
              <input name="bathrooms" type="number" min={0} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Area (m²)</label>
              <input name="area" type="number" min={0} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-white rounded-2xl border border-neutral-100 p-5">
          <h2 className="font-semibold text-neutral-800 text-sm mb-3">Amenities</h2>
          <div className="grid grid-cols-3 gap-2">
            {AMENITY_LIST.map(name => (
              <button
                key={name}
                type="button"
                onClick={() => toggleAmenity(name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${
                  amenities.includes(name)
                    ? "border-amber-400 bg-amber-50 text-amber-800"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                  amenities.includes(name) ? "bg-amber-400 border-amber-400" : "border-neutral-300"
                }`}>
                  {amenities.includes(name) && <span className="text-white text-xs leading-none">✓</span>}
                </div>
                {name}
              </button>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-neutral-800 text-sm">Property images</h2>
            <label className="cursor-pointer flex items-center gap-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg text-neutral-700 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Uploading..." : "Upload files"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
          <p className="text-xs text-neutral-400">First image is the cover photo. You can also paste URLs below.</p>
          <div className="space-y-2">
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-neutral-300 w-4 text-right">{i + 1}</span>
                <input
                  value={img}
                  onChange={e => setImages(prev => prev.map((v, j) => j === i ? e.target.value : v))}
                  placeholder="https://..."
                  className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                {i === 0 && <span className="text-xs text-amber-600 font-medium w-12">Cover</span>}
                {i > 0 && (
                  <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="text-neutral-300 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setImages(prev => [...prev, ""])}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add image URL
          </button>
        </section>

        {/* Agent */}
        <section className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-4">
          <h2 className="font-semibold text-neutral-800 text-sm">Agent / contact</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Agent name</label>
              <input name="agent_name" defaultValue="AddisNest Agent" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input name="agent_phone" placeholder="+251..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input name="agent_whatsapp" placeholder="251..." className={inputClass} />
            </div>
          </div>
        </section>

        {/* Publish */}
        <section className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-4">
          <h2 className="font-semibold text-neutral-800 text-sm">Publish settings</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" defaultValue="active" className={inputClass}>
                <option value="active">Active (visible)</option>
                <option value="draft">Draft (hidden)</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" name="is_featured" id="feat" className="w-4 h-4 accent-amber-500" />
              <label htmlFor="feat" className="text-sm text-neutral-700">Mark as featured listing</label>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-10">
          <button type="submit" disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            {saving ? "Publishing..." : "Publish listing"}
          </button>
          <button type="button" onClick={onSuccess}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Cancel
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

      </form>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    hidden: "bg-neutral-100 text-neutral-500",
    draft: "bg-neutral-100 text-neutral-500",
    sold: "bg-blue-100 text-blue-700",
    rented: "bg-purple-100 text-purple-700",
    pending: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${map[status] ?? "bg-neutral-100 text-neutral-500"}`}>
      {status}
    </span>
  );
}