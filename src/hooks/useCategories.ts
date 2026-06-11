'use client';
import { useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import { Category } from '@/types';

/**
 * Hook untuk CRUD kategori
 */
export function useCategories() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ambil semua kategori
   */
  const getAll = async (): Promise<Category[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<Category[]>('/categories');
      return res.data;
    } catch (err: any) {
      setError('Gagal mengambil data kategori');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buat kategori baru (admin only)
   */
  const create = async (name: string): Promise<Category> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.post<Category>('/categories', { name });
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal membuat kategori';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update kategori (admin only)
   */
  const update = async (id: string, name: string): Promise<Category> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.patch<Category>(`/categories/${id}`, { name });
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengupdate kategori';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hapus kategori (admin only)
   */
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.delete(`/categories/${id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menghapus kategori';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, create, update, remove, loading, error };
}