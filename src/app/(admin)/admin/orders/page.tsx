'use client';

import { useEffect, useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types';
import { ClipboardList, Calendar, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';


const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
  paid: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
};

const statusLabels: Record<string, string> = {
  pending: 'Menunggu',
  paid: 'Dibayar',
  shipped: 'Dikirim',
  done: 'Selesai',
};

export default function AdminOrdersPage() {
  const { getAllOrders, updateStatus } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    getAllOrders()
      .then(setOrders)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const result = await Swal.fire({
      title: 'Update Status?',
      text: `Ubah status transaksi menjadi "${statusLabels[newStatus] || newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, perbarui!',
      cancelButtonText: 'Batal',
      background: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
      color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#ffffff' : '#0f172a',
    });

    if (result.isConfirmed) {
      try {
        await updateStatus(orderId, newStatus);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Status transaksi berhasil diperbarui',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
        fetchData();
      } catch {
        Swal.fire({ 
          icon: 'error', 
          title: 'Gagal', 
          text: 'Gagal memperbarui status pesanan',
          confirmButtonColor: '#6366f1' 
        });
      }
    }
  };

  return (
    <div className="w-full space-y-8 selection:bg-indigo-500 selection:text-white">
      
      
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Daftar Pesanan
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Kelola status pengiriman, pantau invoice masuk, dan rekam jejak checkout pelanggan.
        </p>
      </div>

      
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[850px] text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-950/60 border-b border-slate-200/60 dark:border-zinc-800/80 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              <tr>
                <th className="w-[30%] px-6 py-4 text-left font-bold">Customer</th>
                <th className="w-[20%] px-6 py-4 text-left font-bold">Tanggal</th>
                
                <th className="w-[20%] px-6 py-4 text-center font-bold">Total Pembayaran</th>
                <th className="w-[15%] px-6 py-4 text-center font-bold">Status</th>
                <th className="w-[15%] px-6 py-4 text-center font-bold">Aksi Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              
              
              {loading ? (
                [...Array(4)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-7 h-7 bg-slate-200 dark:bg-zinc-800 rounded-full shrink-0" />
                      <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-32" />
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-24" /></td>
                    
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-20 mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded-full w-14 mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-7 bg-slate-200 dark:bg-zinc-800 rounded-lg w-24 mx-auto" /></td>
                  </tr>
                ))
              ) : (
                orders.map((order) => {
                  const customerName = order.user?.name || 'Anonim';
                  const initialName = customerName.charAt(0).toUpperCase();

                  return (
                    <tr 
                      key={order.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/30 transition-colors group"
                    >
                      
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700/60 text-xs font-bold flex items-center justify-center shrink-0">
                            {initialName}
                          </div>
                          <span className="block truncate" title={customerName}>
                            {customerName}
                          </span>
                        </div>
                      </td>

                      
                      <td className="px-6 py-4 text-slate-500 dark:text-zinc-400 font-medium whitespace-nowrap overflow-hidden">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </td>

                      
                      <td className="px-6 py-4 text-center font-black text-slate-900 dark:text-white whitespace-nowrap overflow-hidden">
                        Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                      </td>

                      
                      <td className="px-6 py-4 text-center whitespace-nowrap overflow-hidden">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-0.5 border text-xs font-bold rounded-full tracking-wide ${
                            statusColors[order.status] || 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>

                      
                      <td className="px-6 py-4 text-center whitespace-nowrap overflow-hidden">
                        <div className="relative inline-flex items-center justify-center">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="appearance-none bg-slate-50 hover:bg-slate-100 dark:bg-zinc-950 dark:hover:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 pl-3 pr-7 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition w-28 text-center"
                          >
                            <option value="pending">Menunggu</option>
                            <option value="paid">Dibayar</option>
                            <option value="shipped">Dikirim</option>
                            <option value="done">Selesai</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400 dark:text-zinc-500 font-medium">
                    <ClipboardList className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-zinc-700" />
                    Belum ada invoice pesanan masuk saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
