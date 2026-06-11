'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { CartItem } from '@/types';
import Swal from 'sweetalert2';

export default function CartPage() {
  const router = useRouter();
  const { getCart, updateItem, removeItem } = useCart();
  const { checkout } = useOrders();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    setLoading(true);
    getCart()
      .then(setCartItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQty = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateItem(itemId, newQty);
      fetchCart();
    } catch {
      Swal.fire({ 
        icon: 'error', 
        title: 'Gagal', 
        text: 'Gagal memperbarui kuantitas produk',
        confirmButtonColor: '#4f46e5',
        background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      });
    }
  };

  const handleRemoveItem = async (itemId: string, productName: string) => {
    const result = await Swal.fire({
      title: 'Hapus Item?',
      text: `${productName} akan dihapus dari keranjang`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
    });

    if (result.isConfirmed) {
      try {
        await removeItem(itemId);
        fetchCart();
        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Item berhasil dikeluarkan dari keranjang',
          timer: 1500,
          showConfirmButton: false,
          background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
        });
      } catch {
        Swal.fire({ 
          icon: 'error', 
          title: 'Gagal', 
          text: 'Gagal menghapus item',
          confirmButtonColor: '#4f46e5',
          background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
        });
      }
    }
  };

  const handleCheckout = async () => {
    const result = await Swal.fire({
      title: 'Konfirmasi Checkout',
      text: 'Apakah Anda yakin ingin memproses pesanan ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Bayar Sekarang!',
      cancelButtonText: 'Batal',
      background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
    });

    if (result.isConfirmed) {
      try {
        await checkout();
        Swal.fire({
          icon: 'success',
          title: 'Checkout Berhasil!',
          text: 'Pesanan Anda sukses dibuat dan sedang diproses admin',
          confirmButtonColor: '#4f46e5',
          background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
        }).then(() => router.push('/orders'));
      } catch (err: any) {
        const message = err.response?.data?.message || 'Checkout gagal dilakukan';
        Swal.fire({ 
          icon: 'error', 
          title: 'Checkout Gagal', 
          text: message,
          confirmButtonColor: '#4f46e5',
          background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
        });
      }
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );

  // Modern Skeleton Loading State
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-9 bg-slate-200 dark:bg-zinc-800 w-48 rounded-xl" />
        <div className="h-64 bg-slate-200 dark:bg-zinc-800 w-full rounded-2xl" />
        <div className="h-24 bg-slate-200 dark:bg-zinc-800 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 selection:bg-indigo-500 selection:text-white">
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <span>Keranjang Belanja</span>
          <span className="text-sm font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
            {cartItems.length} Item
          </span>
        </h1>
      </div>

      {cartItems.length === 0 ? (
        /* Empty State Premium Card */
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl p-12 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/10 blur-2xl pointer-events-none rounded-full" />
          <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-slate-100 dark:border-zinc-800 shadow-inner">
            🛒
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Keranjang Belanja Kosong</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mb-6">
            Kamu belum memasukkan barang apa pun. Yuk, balik ke katalog utama dan cari barang favoritmu!
          </p>
          <button
            onClick={() => router.push('/products')}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 duration-200"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-zinc-800/80 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Produk</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Harga</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Jumlah</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Subtotal</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {cartItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.product.name}
                        </p>
                        {item.product.category && (
                          <span className="inline-block mt-1 text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded-md">
                            {item.product.category.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-medium text-slate-700 dark:text-zinc-300 text-sm">
                      Rp {Number(item.product.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl w-fit mx-auto border border-slate-200/40 dark:border-zinc-800/60">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 flex items-center justify-center font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-sm disabled:opacity-40 transition-all"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 flex items-center justify-center font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-sm transition-all"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-slate-900 dark:text-white text-sm">
                      Rp {(Number(item.product.price) * item.quantity).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleRemoveItem(item.id, item.product.name)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE RESPONSIVE LIST CARD VIEW */}
          <div className="block md:hidden space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.product.name}</h4>
                    {item.product.category && (
                      <span className="inline-block mt-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                        {item.product.category.name}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id, item.product.name)}
                    className="text-xs font-bold text-red-500 p-1"
                  >
                    Hapus
                  </button>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-zinc-800/60">
                  <div className="text-xs text-slate-500">
                    Harga: <span className="font-semibold text-slate-700 dark:text-zinc-300">Rp {Number(item.product.price).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Sub: Rp {(Number(item.product.price) * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl border border-slate-200/40 dark:border-zinc-800/60">
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center font-bold text-xs shadow-sm disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center font-bold text-xs shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL SUMMARY & CHECKOUT BOX */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm">
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">
                Total Ringkasan Belanja ({cartItems.length} item):
              </p>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                Rp {totalPrice.toLocaleString('id-ID')}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-10 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 duration-200 text-center"
            >
              Proses Checkout
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}