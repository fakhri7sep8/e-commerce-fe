import axios, { AxiosResponse, AxiosError } from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://e-commerce-be-eosin.vercel.app',
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