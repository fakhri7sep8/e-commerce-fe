'use client';

import { useEffect, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Product, Category } from '@/types';
import { Plus, Edit2, Trash2, Image, Layers, Package, X } from 'lucide-react';
import Swal from 'sweetalert2';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
}

export default function AdminProductsPage() {
  const { getAll, create, update, remove } = useProducts();
  const { getAll: getAllCategories } = useCategories();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    categoryId: '',
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([getAll(), getAllCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForm = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setForm({
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        stock: product.stock,
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId || '',
      });
    } else {
      setEditingId(null);
      setForm({ name: '', description: '', price: 0, stock: 0, imageUrl: '', categoryId: '' });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || form.price <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Nama wajib diisi dan harga harus lebih dari 0',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    const sanitizedImageUrl = form.imageUrl.trim();

    if (sanitizedImageUrl && !/^https?:\/\//i.test(sanitizedImageUrl)) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'URL gambar harus diawali dengan http:// atau https://',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    try {
      const payload = {
        ...form,
        imageUrl: sanitizedImageUrl || undefined,
      };

      if (editingId) {
        await update(editingId, payload);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Produk berhasil diperbarui',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      } else {
        await create(payload);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Produk berhasil ditambahkan',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
         });
      }
      closeForm();
      fetchData();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menyimpan produk';
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: message,
        confirmButtonColor: '#6366f1',
      });
    }
  };

  const handleDelete = async (product: Product) => {
    const result = await Swal.fire({
      title: 'Hapus Produk?',
      text: `${product.name} akan dihapus secara permanen`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
      color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#ffffff' : '#0f172a',
    });

    if (result.isConfirmed) {
      try {
        await remove(product.id);
        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Produk berhasil dihapus',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
        fetchData();
      } catch {
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus produk', confirmButtonColor: '#6366f1' });
      }
    }
  };

  return (
    <div className="w-full space-y-8 selection:bg-indigo-500 selection:text-white">
      
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Kelola Produk
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Tambah, ubah, atau hapus katalog produk yang tersedia di toko Anda.
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-500/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </button>
      </div>

      
      {showForm && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            
            
            <div className="p-6 border-b border-slate-100 dark:border-zinc-800/60 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" />
                {editingId ? 'Edit Detail Produk' : 'Buat Produk Baru'}
              </h2>
              <button 
                onClick={closeForm} 
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5">
                  Nama Produk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jaket Varsity Cyberpunk v2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-950 dark:text-white font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5">
                  Deskripsi Lengkap
                </label>
                <textarea
                  placeholder="Tulis spesifikasi bahan, ukuran, atau detail produk..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-950 dark:text-white transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5">
                    Harga (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price || ''}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-950 dark:text-white font-bold transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5">
                    Jumlah Stok
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-950 dark:text-white font-bold transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-950 dark:text-white font-semibold transition appearance-none cursor-pointer"
                  >
                    <option value="">Pilih Kategori Produk</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <Layers className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5">
                  URL Gambar Produk
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-zinc-950 dark:text-white transition"
                  />
                  <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              
              <div className="flex gap-3 pt-3 shrink-0">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition shadow-sm shadow-indigo-500/10"
                >
                  {editingId ? 'Simpan Perubahan' : 'Rilis Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-950/60 border-b border-slate-200/60 dark:border-zinc-800/80 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Produk</th>
                <th className="px-6 py-4 text-right font-bold">Harga</th>
                <th className="px-6 py-4 text-center font-bold">Stok</th>
                <th className="px-6 py-4 text-left font-bold">Kategori</th>
                <th className="px-6 py-4 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
              
              
              {loading ? (
                [...Array(4)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-zinc-800 rounded-lg shrink-0" />
                      <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-32" />
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-20 ml-auto" /></td>
                    <td className="px-6 py-4"><div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded-full w-12 mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : (
                products.map((product) => (
                  <tr 
                    key={product.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/30 transition-colors group"
                  >
                    
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white max-w-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/60 overflow-hidden shrink-0 flex items-center justify-center relative">
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          ) : (
                            <Package className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <span className="truncate block" title={product.name}>
                          {product.name}
                        </span>
                      </div>
                    </td>

                    
                    <td className="px-6 py-4 text-right font-bold text-slate-700 dark:text-zinc-300">
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </td>

                    
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                          product.stock > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/30'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-950/25 dark:text-rose-400 dark:border-rose-900/30'
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} Ready` : 'Habis'}
                      </span>
                    </td>

                    
                    <td className="px-6 py-4 text-slate-600 dark:text-zinc-400 font-medium whitespace-nowrap">
                      {product.category?.name ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-zinc-700">—</span>
                      )}
                    </td>

                    
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openForm(product)}
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-bold transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <span className="text-slate-200 dark:text-zinc-800">|</span>
                        <button
                          onClick={() => handleDelete(product)}
                          className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 text-xs font-bold transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 dark:text-zinc-500 font-medium">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-zinc-700" />
                    Belum ada data produk terdaftar.
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
