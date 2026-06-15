import axios, { AxiosResponse, AxiosError } from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://e-commerce-be-eosin.vercel.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const isAuthRequest = (error.config?.url || '').startsWith('/auth/login') ||
                          (error.config?.url || '').startsWith('/auth/register');

    if (error.response?.status === 401 && !isAuthRequest) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
