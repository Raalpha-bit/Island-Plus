'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Users, 
  BarChart2, 
  MessageSquare, 
  Video, 
  DollarSign, 
  Settings,
  ArrowLeft
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function CreatorDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/overview' },
    { label: 'Content', icon: ImageIcon, href: '/content' },
    { label: 'Subscribers', icon: Users, href: '/subscribers' },
    { label: 'Analytics', icon: BarChart2, href: '/analytics' },
    { label: 'Community', icon: MessageSquare, href: '/community' },
    { label: 'Live Stream', icon: Video, href: '/live' },
    { label: 'Earnings', icon: DollarSign, href: '/earnings' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-black-deep">
      <Navbar />
      
      {/* Creator Sidebar */}
      <aside className="fixed left-0 top-16 lg:top-18 bottom-0 w-64 glass-strong border-r border-white/5 hidden md:flex flex-col z-40 bg-black-deep/95">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-purple-neon flex items-center gap-2">
            Creator Studio
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-4 no-scrollbar">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.includes(item.href);
              return (
                <Link
                  key={item.label}
                  href={`/creator-dashboard${item.href}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-purple-royal text-white shadow-[0_0_15px_rgba(123,46,255,0.3)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-purple-neon'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-white/5">
          <Link href="/dashboard/feed" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Island+
          </Link>
        </div>
      </aside>

      <main className="pt-16 lg:pt-18 md:pl-64 min-h-screen pb-20 md:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
