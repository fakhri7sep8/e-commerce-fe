'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

export default function ProfilePage() {
  const { getProfile, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setError('Gagal memuat data profil Anda'))
      .finally(() => setLocalLoading(false));
  }, []);

  const isLoading = authLoading || localLoading;

  // Modern Shimmer Skeleton Loading
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-9 bg-slate-200 dark:bg-zinc-800 w-40 rounded-xl" />
        <div className="bg-slate-200 dark:bg-zinc-800 h-[380px] w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border border-red-100 dark:border-red-900/30">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Terjadi Kesalahan</h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
          {error}. Silakan segarkan halaman atau coba masuk kembali ke akun Anda.
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 selection:bg-indigo-500 selection:text-white">
      
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Profil Saya
        </h1>
      </div>

      {/* Profile Card Container */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl shadow-sm overflow-hidden relative">
        {/* Decorative Ambient Background Top-Bar */}
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 dark:opacity-40" />

        <div className="p-6 sm:p-8 pt-0 relative">
          
          {/* Avatar Section Floating Over the Background */}
          <div className="flex justify-start -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white text-3xl font-black flex items-center justify-center shadow-lg shadow-indigo-500/20 border-4 border-white dark:border-zinc-900 selection:bg-transparent">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>
          </div>

          {/* Profile Fields Group */}
          <div className="space-y-5">
            
            {/* Field: Nama */}
            <div className="bg-slate-50/50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/60 transition-colors hover:border-slate-200 dark:hover:border-zinc-800">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                Nama Lengkap
              </label>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {profile.name}
              </p>
            </div>

            {/* Field: Email */}
            <div className="bg-slate-50/50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/60 transition-colors hover:border-slate-200 dark:hover:border-zinc-800">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                Alamat Email
              </label>
              <p className="text-base font-medium text-slate-700 dark:text-zinc-300">
                {profile.email}
              </p>
            </div>

            {/* Field: Hak Akses / Role */}
            <div className="bg-slate-50/50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/60 transition-colors hover:border-slate-200 dark:hover:border-zinc-800 flex justify-between items-center">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-0.5">
                  Hak Akses Akun
                </label>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Menentukan otoritas fitur di dalam sistem
                </p>
              </div>

              {/* Dynamic Status Badge */}
              <span
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${
                  profile.role === 'admin'
                    ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50'
                }`}
              >
                {profile.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
              </span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}