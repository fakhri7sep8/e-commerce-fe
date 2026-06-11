'use client';
import { useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import { Product } from '@/types';

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
}

/**
 * Hook untuk CRUD produk
 */
export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ambil semua produk
   */
  const getAll = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<Product[]>('/products');
      return res.data;
    } catch (err: any) {
      setError('Gagal mengambil data produk');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ambil satu produk berdasarkan ID
   */
  const getById = async (id: string): Promise<Product> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<Product>(`/products/${id}`);
      return res.data;
    } catch (err: any) {
      setError('Produk tidak ditemukan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buat produk baru (admin only)
   */
  const create = async (data: CreateProductData): Promise<Product> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.post<Product>('/products', data);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal membuat produk';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update produk (admin only)
   */
  const update = async (id: string, data: UpdateProductData): Promise<Product> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.patch<Product>(`/products/${id}`, data);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengupdate produk';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hapus produk (admin only)
   */
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.delete(`/products/${id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menghapus produk';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, getById, create, update, remove, loading, error };
}