'use client';
import { useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import { User } from '@/types';

interface LoginResponse {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * Hook untuk autentikasi (login, register, logout, getProfile)
 */
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login user
   * Cookie access_token otomatis diset oleh backend (httpOnly)
   */
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.post<LoginResponse>('/auth/login', { email, password });
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login gagal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register user baru
   */
  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.post('/auth/register', data);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registrasi gagal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   * Backend akan clear cookie access_token
   */
  const logout = async () => {
    setLoading(true);
    try {
      await axiosClient.post('/auth/logout');
      // Redirect ke halaman login
      window.location.href = '/login';
    } catch (err: any) {
      setError('Logout gagal');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ambil profile user dari token yang ada di cookie
   */
  const getProfile = async (): Promise<User> => {
    setLoading(true);
    try {
      const res = await axiosClient.get<User>('/auth/profile');
      return res.data;
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, logout, getProfile, loading, error };
}