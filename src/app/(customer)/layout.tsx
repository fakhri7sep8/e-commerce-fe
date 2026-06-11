'use client';

import Navbar from '@/components/Navbar';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col">
      {/* Navbar Utama */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow w-full">
        {children}
      </main>
    </div>
  );
}