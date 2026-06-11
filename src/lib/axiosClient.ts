import axios, { AxiosResponse, AxiosError } from 'axios';

/**
 * Axios client terpusat untuk komunikasi dengan backend NestJS
 * - Base URL dari NEXT_PUBLIC_API_URL
 * - withCredentials: true agar cookie httpOnly otomatis terkirim
 * - Interceptor: jika 401 → redirect ke /login
 */

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true, // penting: kirim cookie access_token otomatis
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: menangani error 401 (token expired / tidak login)
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect ke halaman login jika token tidak valid
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;