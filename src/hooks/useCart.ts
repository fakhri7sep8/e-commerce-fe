'use client';
import { useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import { CartItem } from '@/types';


export function useCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
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
