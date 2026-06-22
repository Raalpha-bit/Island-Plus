'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert,
  Users,
  Star,
  Flag,
  CheckSquare,
  BarChart,
  LogOut
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Platform Overview', icon: BarChart, href: '/dashboard' },
    { label: 'Members', icon: Users, href: '/users' },
    { label: 'Creators', icon: Star, href: '/creators' },
    { label: 'Reports', icon: Flag, href: '/reports' },
    { label: 'Verification Queue', icon: CheckSquare, href: '/verification' },
  ];

  return (
    <div className="min-h-screen bg-black-deep">
      <Navbar />
      
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-16 lg:top-18 bottom-0 w-64 glass-strong border-r border-red-500/20 hidden md:flex flex-col z-40 bg-black-deep">
        <div className="p-4 border-b border-white/5 bg-red-500/5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-red-500 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Security Admin
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-4 no-scrollbar">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.includes(item.href);
              return (
                <Link
                  key={item.label}
                  href={`/admin${item.href}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-red-500/20 text-white border-l-2 border-red-500' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-red-400' : 'group-hover:text-gray-300'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full">
            <LogOut className="w-4 h-4" /> Exit Admin Panel
          </button>
        </div>
      </aside>

      <main className="pt-16 lg:pt-18 md:pl-64 min-h-screen pb-20 md:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
