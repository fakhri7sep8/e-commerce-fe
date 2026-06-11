'use client';

import { useEffect, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useCategories } from '@/hooks/useCategories';

export default function AdminDashboard() {
  const { getAll } = useProducts();
  const { getAllOrders } = useOrders();
  const { getAll: getAllCategories } = useCategories();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAll().then((products) => ({ key: 'totalProducts' as const, value: products.length })),
      getAllCategories().then((cats) => ({ key: 'totalCategories' as const, value: cats.length })),
      getAllOrders().then((orders) => ({ key: 'totalOrders' as const, value: orders.length })),
    ])
      .then((results) => {
        const newStats = { totalProducts: 0, totalCategories: 0, totalOrders: 0 };
        results.forEach((r) => {
          newStats[r.key] = r.value;
        });
        setStats(newStats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Konfigurasi warna ikon bergaya minimalis premium (Border + Soft Background)
  const cards = [
    { 
      label: 'Total Produk', 
      value: stats.totalProducts, 
      style: 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400', 
      icon: '📦' 
    },
    { 
      label: 'Total Kategori', 
      value: stats.totalCategories, 
      style: 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400', 
      icon: '🏷️' 
    },
    { 
      label: 'Total Pesanan', 
      value: stats.totalOrders, 
      style: 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400', 
      icon: '📋' 
    },
  ];

  // Shimmer Pulse Grid Skeleton
  if (loading) {
    return (
      <div className="animate-pulse space-y-8 w-full">
        <div className="h-9 bg-slate-200 dark:bg-zinc-800 w-44 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-zinc-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full selection:bg-indigo-500 selection:text-white">
      
      {/* Dashboard Headline */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Pantau ringkasan metrik data toko dan performa inventaris produk Anda di sini.
        </p>
      </div>

      {/* Modern Analytics Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl p-6 flex items-center gap-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 group relative overflow-hidden"
          >
            {/* Top Light Accent Glow Effect */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-200 dark:via-zinc-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Icon Wrapper Badge */}
            <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-2xl shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300 ${card.style}`}>
              {card.icon}
            </div>

            {/* Information Label & Value */}
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block truncate">
                {card.label}
              </p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}