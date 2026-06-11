import Link from 'next/link';

/**
 * Halaman Landing Page / Beranda - TokoKita
 * Tema: Modern Minimalist & Clean Tech (Full Layout)
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 overflow-x-hidden selection:bg-indigo-500 selection:text-white relative">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-30 dark:opacity-20 blur-[130px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 -z-10" />

      {/* Header Statis (Tanpa Link Menu Mati) */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2.5 font-black text-xl tracking-tight">
          <span className="bg-indigo-600 text-white p-2 rounded-xl text-lg shadow-md shadow-indigo-500/20">
            🛒
          </span>
          <span>
            Toko<span className="text-indigo-600 dark:text-indigo-400">Kita</span>
          </span>
        </div>
        
        {/* Indikator Status Toko Aktual */}
        <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Sistem Online
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto my-12">
        
        {/* Badge Trend */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-8">
          🚀 Elevate Your Shopping Experience
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 max-w-3xl leading-[1.15]">
          Belanja Mudah, Aman &{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-purple-400">
            Makin Hemat
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mb-12 leading-relaxed">
          Temukan berbagai produk kebutuhan harian, fashion, hingga gadget impian Anda dengan jaminan original dan pelayanan terbaik.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center items-center">
          <Link
            href="/login"
            className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition duration-200 text-center shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transform"
          >
            Masuk ke Akun
          </Link>
          <Link
            href="/register"
            className="w-full sm:flex-1 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold py-4 px-8 rounded-xl border-2 border-indigo-600 dark:border-indigo-500 transition duration-200 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transform"
          >
            Daftar Sekarang
          </Link>
        </div>

        {/* Ganti Stats Jadi Poin Keunggulan (Lebih masuk akal tanpa link) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-20 pt-10 border-t border-slate-200/60 dark:border-zinc-800/60 w-full max-w-3xl text-left sm:text-center">
          <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
            <span className="text-2xl p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">🛡️</span>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Keamanan Terjamin</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">Transaksi enkripsi penuh</p>
            </div>
          </div>
          <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
            <span className="text-2xl p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">⚡</span>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Proses Cepat</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">Layanan instan tanpa ribet</p>
            </div>
          </div>
          <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
            <span className="text-2xl p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">🌟</span>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Produk Pilihan</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">Kualitas terbaik di kelasnya</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Bersih */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-center border-t border-slate-200/40 dark:border-zinc-900/40 text-xs sm:text-sm text-slate-400 dark:text-zinc-600 font-medium">
        <p>© 2026 TokoKita. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}