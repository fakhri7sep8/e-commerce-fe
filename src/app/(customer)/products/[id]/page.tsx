'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
import Swal from 'sweetalert2';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getById } = useProducts();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getById(id)
      .then(setProduct)
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Produk tidak ditemukan',
          text: 'Produk yang Anda cari mungkin sudah dihapus atau tidak tersedia.',
          confirmButtonColor: '#4f46e5',
          background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
        }).then(() => router.push('/products'));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem(product.id, quantity);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Masuk Keranjang!',
        text: `${quantity}x ${product.name} telah ditambahkan`,
        confirmButtonColor: '#4f46e5',
        background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menambahkan produk ke keranjang belanja',
        confirmButtonColor: '#4f46e5',
        background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      });
    }
  };
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 dark:bg-zinc-800 w-24 rounded-lg" />
        <div className="bg-slate-200 dark:bg-zinc-800 h-[450px] w-full rounded-3xl" />
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 selection:bg-indigo-500 selection:text-white">
      
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Produk
      </button>

      
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          
          <div className="h-96 md:h-full min-h-[380px] bg-slate-50 dark:bg-zinc-950 flex items-center justify-center relative p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-zinc-800/70">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover max-h-[400px] rounded-2xl shadow-sm"
              />
            ) : (
              <span className="text-slate-300 dark:text-zinc-700 text-8xl selection:bg-transparent">📦</span>
            )}

            {product.category && (
              <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800">
                🏷️ {product.category.name}
              </span>
            )}
          </div>

          
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </span>
              </div>

              <hr className="border-slate-100 dark:border-zinc-800/80" />

              
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi Produk</h3>
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-prose">
                  {product.description || 'Produk ini belum memiliki deskripsi detail resmi dari penjual.'}
                </p>
              </div>
            </div>

            
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400 dark:text-zinc-500">Status Ketersediaan</span>
                <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] uppercase tracking-wider ${
                  isOutOfStock 
                    ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400' 
                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                }`}>
                  {isOutOfStock ? 'Stok Habis' : `Tersedia ${product.stock} Unit`}
                </span>
              </div>

              {!isOutOfStock && (
                /* Quantity Counter Picker */
                <div className="flex items-center justify-between bg-slate-50 dark:bg-zinc-950 p-3 rounded-2xl border border-slate-200/40 dark:border-zinc-800/60">
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Tentukan Jumlah</span>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-black text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full font-bold text-sm py-3.5 px-6 rounded-xl transition-all duration-200 text-center ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.99]'
                }`}
              >
                {isOutOfStock ? 'Maaf, Stok Sedang Kosong' : 'Masukkan ke Keranjang Belanja'}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
