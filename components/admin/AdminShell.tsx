'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Plus, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { toAppPath } from '@/lib/routes';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Listings', icon: Building2 },
  { href: '/admin/listings/new', label: 'Add property', icon: Plus },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function signOut() {
    await createClient().auth.signOut();
    window.location.href = '/admin/login';
  }

  if (pathname === '/admin/login' || pathname === '/admin') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-stone-100">
      <aside className="hidden lg:flex w-64 flex-col bg-[#0c0c0c] text-white p-6">
        <Link href="/" className="font-display text-xl mb-10">
          Addis<span className="text-[#C9A227]">Nest</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={toAppPath(href)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-[#C9A227] text-[#0c0c0c]'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-stone-400 hover:text-white hover:bg-white/5 w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
