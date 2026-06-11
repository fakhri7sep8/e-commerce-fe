'use client';

import { useEffect, useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types';
import Swal from 'sweetalert2';

/**
 * Desain Badge Status yang Modern (Solid border dengan latar transparan)
 */
const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
  paid: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
};

const statusLabels: Record<string, string> = {
  pending: 'Menunggu Verifikasi',
  paid: 'Sudah Dibayar',
  shipped: 'Sedang Dikirim',
  done: 'Selesai',
};

export default function OrdersPage() {
  const { getMyOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal mengambil data riwayat pesanan Anda',
          confirmButtonColor: '#4f46e5',
          background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Modern Pulse Skeleton Loading
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-9 bg-slate-200 dark:bg-zinc-800 w-52 rounded-xl" />
        <div className="h-48 bg-slate-200 dark:bg-zinc-800 w-full rounded-2xl" />
        <div className="h-48 bg-slate-200 dark:bg-zinc-800 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 selection:bg-indigo-500 selection:text-white">
      
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <span>Riwayat Pesanan</span>
          <span className="text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2.5 py-1 rounded-md border border-slate-200/40 dark:border-zinc-700/50---">
            Total: {orders.length}
          </span>
        </h1>
      </div>

      {orders.length === 0 ? (
        /* Empty State Card */
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl p-12 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/5 blur-2xl pointer-events-none rounded-full" />
          <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-slate-100 dark:border-zinc-800 shadow-inner">
            📋
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Belum Ada Pesanan</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
            Kamu belum pernah melakukan transaksi apa pun di toko ini. Riwayat belanjaanmu bakal muncul di sini nanti.
          </p>
        </div>
      ) : (
        /* Orders Stack Container */
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm p-5 sm:p-6 transition-all hover:border-slate-300 dark:hover:border-zinc-700"
            >
              {/* Header Card: ID, Tanggal, & Badge Status */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 dark:border-zinc-800 gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    ID ORDER: #{order.id.slice(0, 8).toUpperCase()}...
                  </p>
                  <p className="text-xs font-medium text-slate-400 dark:text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })} WIB
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                    statusStyles[order.status] || 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              {/* DESKTOP VIEW: Items Table */}
              <div className="hidden md:block pt-4 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800/50">
                      <th className="pb-2.5">Nama Produk</th>
                      <th className="text-center pb-2.5">Jumlah</th>
                      <th className="text-right pb-2.5">Harga Satuan</th>
                      <th className="text-right pb-2.5">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-800/60 text-sm font-medium text-slate-700 dark:text-zinc-300">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          {item.product.name}
                        </td>
                        <td className="py-3 text-center text-slate-500 dark:text-zinc-400 font-semibold">
                          {item.quantity}x
                        </td>
                        <td className="py-3 text-right text-slate-500 dark:text-zinc-400">
                          Rp {Number(item.price).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                          Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE VIEW: Compact Item List Cards */}
              <div className="block md:hidden pt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="bg-slate-50/50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-zinc-800/60 flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.product.name}</h4>
                      <p className="text-slate-400">
                        {item.quantity}x @ Rp {Number(item.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-right">
                      Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Card Footer: Total Price Ringkasan */}
              <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 mt-4 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Pembayaran
                </span>
                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                  Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}