'use client';

import { useEffect, useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types';
import { FolderPlus, Pencil, Trash2, Save, X, Layers } from 'lucide-react';
import Swal from 'sweetalert2';

/**
 * Halaman manajemen kategori (Admin Premium)
 */
export default function AdminCategoriesPage() {
  const { getAll, create, update, remove } = useCategories();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // State form inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [editName, setEditName] = useState('');

  const fetchData = () => {
    setLoading(true);
    getAll()
      .then(setCategories)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Nama kategori wajib diisi',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    try {
      await create(newName);
      setNewName('');
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kategori berhasil ditambahkan',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      fetchData();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menambah kategori';
      Swal.fire({ icon: 'error', title: 'Gagal', text: message, confirmButtonColor: '#6366f1' });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    try {
      await update(id, editName);
      setEditingId(null);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kategori berhasil diupdate',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      fetchData();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal update kategori';
      Swal.fire({ icon: 'error', title: 'Gagal', text: message, confirmButtonColor: '#6366f1' });
    }
  };

  const handleDelete = async (category: Category) => {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
      title: 'Hapus Kategori?',
      text: `Kategori "${category.name}" akan dihapus permanen`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: isDark ? '#18181b' : '#ffffff',
      color: isDark ? '#ffffff' : '#0f172a',
    });

    if (result.isConfirmed) {
      try {
        await remove(category.id);
        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Kategori berhasil dihapus',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
        fetchData();
      } catch {
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus kategori', confirmButtonColor: '#6366f1' });
      }
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  return (
    <div className="w-full space-y-8 selection:bg-indigo-500 selection:text-white">
      
      {/* Dashboard Headline */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Manajemen Kategori
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Tambah, ubah, dan organisasikan kategori produk toko Anda agar mudah dieksplorasi pembeli.
        </p>
      </div>

      {/* Form Tambah Kategori */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl shadow-sm p-4 flex gap-3 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ketik nama kategori baru..."
            className="w-full pl-4 pr-4 py-2.5 border border-slate-200/80 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 dark:bg-zinc-950 font-medium text-sm text-slate-900 dark:text-white transition placeholder:text-slate-400"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
        </div>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition flex items-center gap-2 text-sm font-bold shadow-sm shadow-indigo-500/10 active:scale-[0.98]"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Main Container Tabel */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {/* Dikunci menggunakan table-fixed agar presisi lurus */}
          <table className="w-full table-fixed min-w-[700px] text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-950/60 border-b border-slate-200/60 dark:border-zinc-800/80 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              <tr>
                <th className="w-[50%] px-6 py-4 text-left font-bold">Nama Kategori</th>
                <th className="w-[25%] px-6 py-4 text-center font-bold">Jumlah Produk</th>
                <th className="w-[25%] px-6 py-4 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              
              {/* Shimmer Bone Skeleton Loader */}
              {loading ? (
                [...Array(3)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-48" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-12 mx-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-slate-200 dark:bg-zinc-800 rounded-lg w-28 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : (
                categories.map((category) => (
                  <tr 
                    key={category.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/30 transition-colors group"
                  >
                    {/* Kolom Nama Kategori / Form Edit Inline */}
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap overflow-hidden">
                      {editingId === category.id ? (
                        <div className="flex items-center gap-2 max-w-md">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-sm border border-indigo-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-zinc-950 text-slate-900 dark:text-white font-medium"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdate(category.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button
                            onClick={() => handleUpdate(category.id)}
                            className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30 transition"
                            title="Simpan"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 transition"
                            title="Batal"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="block truncate" title={category.name}>
                          {category.name}
                        </span>
                      )}
                    </td>

                    {/* Kolom Jumlah Produk Terpusat */}
                    <td className="px-6 py-4 text-center font-bold text-slate-600 dark:text-zinc-400 whitespace-nowrap overflow-hidden">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded-full text-xs font-bold text-slate-700 dark:text-zinc-300">
                        {(category as any).products?.length || 0} Item
                      </span>
                    </td>

                    {/* Kolom Tombol Aksi Terpusat */}
                    <td className="px-6 py-4 text-center whitespace-nowrap overflow-hidden">
                      {editingId !== category.id && (
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => startEdit(category)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:hover:bg-indigo-950/50 rounded-xl transition border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900/30"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/50 rounded-xl transition border border-transparent hover:border-rose-200 dark:hover:border-rose-900/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}

              {/* Tampilan Jika Data Kosong */}
              {!loading && categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-16 text-slate-400 dark:text-zinc-500 font-medium">
                    <Layers className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-zinc-700" />
                    Belum ada kategori terdaftar saat ini.
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