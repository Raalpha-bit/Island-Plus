'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated (using simple timeout to simulate check for now)
    const timeout = setTimeout(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated && !isLoading) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-black-deep">
      <Navbar />
      <Sidebar />
      <main className="pt-16 lg:pt-18 md:pl-64 pb-20 md:pb-0 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
