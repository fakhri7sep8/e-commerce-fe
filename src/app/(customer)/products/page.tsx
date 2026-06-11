'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
import Swal from 'sweetalert2';

export default function ProductsPage() {
  const { getAll } = useProducts();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAll()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      await addItem(productId, 1);
      
      // Toast notification premium penambah barang
      Swal.fire({
        icon: 'success',
        title: 'Berhasil dimasukkan!',
        text: `${productName}`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
        iconColor: '#6366f1',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menambahkan produk ke keranjang',
        confirmButtonColor: '#4f46e5',
        background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      });
    }
  };

  // Premium Grid Skeleton Loading
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
        <div className="h-9 bg-slate-200 dark:bg-zinc-800 w-48 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[380px] bg-slate-200 dark:bg-zinc-800 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 selection:bg-indigo-500 selection:text-white">
      
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <span>Semua Produk</span>
          <span className="text-sm font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
            {products.length} Barang
          </span>
        </h1>
      </div>

      {products.length === 0 ? (
        /* Empty State Premium */
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl p-12 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/5 blur-2xl pointer-events-none rounded-full" />
          <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-slate-100 dark:border-zinc-800 shadow-inner">
            📭
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Katalog Produk Kosong</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
            Admin belum mengunggah barang apa pun saat ini. Silakan kembali beberapa saat lagi ya!
          </p>
        </div>
      ) : (
        /* Products Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const isOutOfStock = product.stock <= 0;
            
            return (
              <div
                key={product.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-300 group flex flex-col h-full"
              >
                {/* Product Thumbnail Container */}
                <div className="h-52 bg-slate-100 dark:bg-zinc-950 flex items-center justify-center relative overflow-hidden border-b border-slate-100 dark:border-zinc-800/60">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-slate-400 dark:text-zinc-600 text-5xl group-hover:scale-110 transition-transform duration-300">📦</span>
                  )}
                  
                  {/* Category Pill Tag */}
                  {product.category && (
                    <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-slate-700 dark:text-zinc-300 px-2.5 py-1 rounded-xl shadow-sm border border-slate-200/40 dark:border-zinc-700/50">
                      {product.category.name}
                    </span>
                  )}
                </div>

                {/* Card Main Body Content */}
                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-1.5">
                    <Link href={`/products/${product.id}`}>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h2>
                    </Link>
                    
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </p>
                  </div>

                  {/* Stock & Action Button Group */}
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400 dark:text-zinc-500">Ketersediaan</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold ${
                        isOutOfStock 
                          ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400' 
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                      }`}>
                        {isOutOfStock ? 'Stok Habis' : `Sisa ${product.stock}`}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product.id, product.name)}
                      disabled={isOutOfStock}
                      className={`w-full font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 text-center ${
                        isOutOfStock
                          ? 'bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98]'
                      }`}
                    >
                      {isOutOfStock ? 'Stok Habis 🚫' : 'Tambah ke Keranjang'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}