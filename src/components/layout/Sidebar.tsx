'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  MessageSquare, 
  Wallet, 
  Bell, 
  Heart, 
  Settings, 
  Compass,
  Crown
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = [
    { label: 'Feed', icon: Home, href: '/dashboard/feed' },
    { label: 'Explore', icon: Compass, href: '/explore' },
    { label: 'Messages', icon: MessageSquare, href: '/dashboard/messages', badge: 3 },
    { label: 'Notifications', icon: Bell, href: '/dashboard/notifications', badge: 12 },
    { label: 'Wallet', icon: Wallet, href: '/dashboard/wallet' },
    { label: 'Favorites', icon: Heart, href: '/dashboard/favorites' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <aside className="fixed left-0 top-16 lg:top-18 bottom-0 w-64 glass-strong border-r border-white/5 hidden md:flex flex-col z-40">
      <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
        {/* User Card */}
        {user && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 mb-8">
            <img src={user.avatar} alt={user.displayName} className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-royal/50" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{user.displayName}</h3>
              <p className="text-xs text-gray-400 truncate">@{user.username}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/explore' && pathname.startsWith('/explore'));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-royal/20 to-transparent text-white border-l-2 border-purple-neon' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-neon' : 'group-hover:text-white'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-purple-royal rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Creator Promo */}
      {user?.role === 'member' && (
        <div className="p-4 m-4 rounded-2xl gradient-purple relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
          <div className="relative z-10 text-center">
            <Crown className="w-6 h-6 text-white mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white mb-1">Become a Creator</h4>
            <p className="text-xs text-white/80 mb-3">Start earning from your exclusive content.</p>
            <Link href="/creator-dashboard/setup" className="block w-full py-2 bg-white text-purple-royal rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
