'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

export default function Navbar() {
  const { logout, getProfile } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    getProfile()
      .then((user) => setProfile(user))
      .catch(() => setProfile(null));
  }, []);

  const isAdmin = profile?.role === 'admin';

  return (
    <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link href={isAdmin ? "/admin" : "/products"} className="flex items-center gap-2 font-black text-xl tracking-tight text-slate-950 dark:text-white">
              <span className="bg-indigo-600 text-white p-1.5 rounded-xl text-sm shadow-md shadow-indigo-500/20">
                🛒
              </span>
              <span>
                Toko<span className="text-indigo-600 dark:text-indigo-400">Kita</span>
              </span>
              {isAdmin && (
                <span className="ml-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-md">
                  Admin
                </span>
              )}
            </Link>
          </div>

          {/* DESKTOP NAVIGATION LINKS */}
          <div className="hidden md:flex items-center gap-1.5">
            {isAdmin ? (
              <>
                <Link href="/admin" className="px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all">
                  Dashboard
                </Link>
                <Link href="/admin/products" className="px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all">
                  Kelola Produk
                </Link>
                <Link href="/admin/orders" className="px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all">
                  Pesanan Masuk
                </Link>
              </>
            ) : (
              <>
                <Link href="/products" className="px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all">
                  Produk
                </Link>
                <Link href="/cart" className="px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all">
                  Keranjang
                </Link>
                <Link href="/orders" className="px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all">
                  Pesanan Saya
                </Link>
              </>
            )}
          </div>

          {/* DESKTOP USER PROFILE & DROPDOWN */}
          <div className="hidden md:flex items-center gap-4">
            {profile ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all text-sm font-semibold text-slate-700 dark:text-zinc-200"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{profile.name}</span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl py-1.5 z-50">
                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/60 font-medium">
                      👤 Profil Saya
                    </Link>
                    <hr className="border-slate-100 dark:border-zinc-800 my-1" />
                    <button 
                      onClick={() => { setIsDropdownOpen(false); logout(); }} 
                      className="w-full flex items-center text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold"
                    >
                      🚪 logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2 px-4 rounded-xl transition-all shadow-md shadow-indigo-500/10">
                Masuk
              </Link>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE PANEL NAVIGATION */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-4 pt-2 pb-4 space-y-1">
          {isAdmin ? (
            <>
              <Link href="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800">
                Dashboard
              </Link>
              <Link href="/admin/products" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800">
                Kelola Produk
              </Link>
              <Link href="/admin/orders" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800">
                Pesanan Masuk
              </Link>
            </>
          ) : (
            <>
              <Link href="/products" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800">
                Produk
              </Link>
              <Link href="/cart" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800">
                Keranjang
              </Link>
              <Link href="/orders" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800">
                Pesanan Saya
              </Link>
            </>
          )}
          
          <hr className="border-slate-100 dark:border-zinc-800 my-2" />
          
          {profile ? (
            <div className="space-y-1 pt-1">
              <Link href="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800">
                👤 Profil ({profile.name})
              </Link>
              <button
                onClick={() => { setIsOpen(false); logout(); }}
                className="w-full text-left block px-3 py-2.5 rounded-xl text-base font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                🚪 logout
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl">
              Masuk
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}