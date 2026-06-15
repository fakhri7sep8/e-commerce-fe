'use client';
import { useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import { Order } from '@/types';


export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const checkout = async (): Promise<Order> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.post<Order>('/orders');
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Checkout gagal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  const getMyOrders = async (): Promise<Order[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<Order[]>('/orders/my');
      return res.data;
    } catch (err: any) {
      setError('Gagal mengambil riwayat order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  const getAllOrders = async (): Promise<Order[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<Order[]>('/orders');
      return res.data;
    } catch (err: any) {
      setError('Gagal mengambil semua order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  const updateStatus = async (id: string, status: string): Promise<Order> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.patch<Order>(`/orders/${id}/status`, { status });
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengupdate status';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { checkout, getMyOrders, getAllOrders, updateStatus, loading, error };
}
