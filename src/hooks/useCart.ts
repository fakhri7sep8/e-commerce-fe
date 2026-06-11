'use client';
import { useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import { CartItem } from '@/types';

/**
 * Hook untuk operasi keranjang belanja (cart)
 */
export function useCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ambil semua item di cart user yang login
   */
  const getCart = async (): Promise<CartItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<CartItem[]>('/cart');
      return res.data;
    } catch (err: any) {
      setError('Gagal mengambil data cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Tambah item ke cart (auto update quantity jika sudah ada)
   */
  const addItem = async (productId: string, quantity: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.post('/cart', { productId, quantity });
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menambah item ke cart';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update quantity item di cart
   */
  const updateItem = async (id: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.patch(`/cart/${id}`, { quantity });
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengupdate cart';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hapus item dari cart
   */
  const removeItem = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.delete(`/cart/${id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menghapus item dari cart';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getCart, addItem, updateItem, removeItem, loading, error };
}