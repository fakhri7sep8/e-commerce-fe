'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Semua field wajib diisi',
        confirmButtonColor: '#4f46e5',
        background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Password minimal 6 karakter',
        confirmButtonColor: '#4f46e5',
        background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Password dan konfirmasi password tidak cocok',
        confirmButtonColor: '#4f46e5',
        background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      });
      return;
    }

    try {
      await register({ name, email, password });
      
      Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil!',
        text: 'Silakan login dengan akun baru Anda',
        confirmButtonColor: '#4f46e5',
        background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      }).then(() => {
        router.push('/login');
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registrasi gagal';
      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: message,
        confirmButtonColor: '#4f46e5',
        background: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 relative selection:bg-indigo-500 selection:text-white">
      
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[450px] pointer-events-none opacity-30 dark:opacity-20 blur-[130px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-indigo-500/5 border border-slate-200/60 dark:border-zinc-800/80 overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px] relative z-10">
        
        
        <div className="hidden md:flex bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
          
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-white w-fit">
            <span className="bg-white/10 backdrop-blur-md text-white p-2 rounded-xl text-base border border-white/10">
              🛒
            </span>
            <span>Toko<span className="text-indigo-200">Kita</span></span>
          </Link>

          <div className="space-y-3">
            <h2 className="text-2xl xl:text-3xl font-black text-white leading-tight">
              Bergabung dan Mulai Petualangan Belanjamu.
            </h2>
           <p className="text-indigo-100/90 text-sm leading-relaxed">
    Daftar akun hari ini untuk mengeksplorasi berbagai macam barang pilihan dan nikmati kemudahan transaksi instan.
  </p>
          </div>

          <div className="text-xs text-indigo-200/50 font-medium">
            &copy; 2026 TokoKita. Hak Cipta Dilindungi.
          </div>
        </div>

        
        <div className="flex flex-col justify-center p-6 sm:p-10 md:p-12 bg-white dark:bg-zinc-900 w-full">
          
          
          <div className="flex justify-between items-center md:hidden mb-6">
            <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-slate-900 dark:text-white">
              <span className="bg-indigo-600 text-white p-1.5 rounded-lg text-xs">🛒</span>
              <span>Toko<span className="text-indigo-600 dark:text-indigo-400">Kita</span></span>
            </Link>
            <Link href="/" className="text-xs font-bold text-slate-500">
              Kembali
            </Link>
          </div>

          
          <div className="hidden md:block mb-4">
            <Link href="/" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
              <svg className="w-3.5 h-3.5 mr-1 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>

          
          <div className="mb-5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1.5">
              Daftar Akun
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              Lengkapi data di bawah ini untuk membuat akun baru.
            </p>
          </div>

          
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap Anda"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white text-sm font-medium"
                disabled={loading}
              />
            </div>

            
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white text-sm font-medium"
                disabled={loading}
              />
            </div>

            
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white text-sm font-medium"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all dark:text-white text-sm font-medium"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 text-sm mt-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Daftar'
              )}
            </button>
          </form>

          
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800 text-center">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
