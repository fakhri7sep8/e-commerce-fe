'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, getProfile } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Produk', icon: '📦' },
    { href: '/admin/categories', label: 'Kategori', icon: '🏷️' },
    { href: '/admin/orders', label: 'Pesanan', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 flex transition-colors duration-300 selection:bg-indigo-500 selection:text-white">
      
      {/* SIDEBAR: Admin Control Center */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-slate-200/60 dark:border-zinc-800/80 flex flex-col shrink-0 sticky top-0 h-screen">
        
        {/* Header Logo & Profil Admin */}
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800/70">
          <Link href="/admin" className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <span>🛡️</span> Admin Panel
          </Link>
          {profile && (
            <div className="mt-3 flex items-center gap-2 bg-slate-50 dark:bg-zinc-950 p-2 rounded-xl border border-slate-200/40 dark:border-zinc-800/40">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white text-xs font-black flex items-center justify-center shadow-sm">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-zinc-400 truncate max-w-37.5">
                {profile.name}
              </p>
            </div>
          )}
        </div>

        {/* List Navigasi Sidebar */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            // Evaluasi mencakup pencocokan sub-route agar menu tetap menyala aktif
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-tight transition-all relative group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-800 dark:hover:text-zinc-200'
                }`}
              >
                {/* Active Indicator Bar Line */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-r-md" />
                )}
                
                <span className={`text-base transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar: Logout Action Button */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800/70">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-[0.98] transition-all"
          >
            <span className="text-base">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* VIEWPORT MAIN STAGE: Tempat disuntikkannya Halaman Konten Admin */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-400 mx-auto w-full">
        {children}
      </main>

    </div>
  );
}