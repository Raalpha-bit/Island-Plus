'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Wallet, Menu, X, User, LogOut, Settings, Crown, Zap } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong shadow-lg shadow-purple-royal/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center glow-purple group-hover:scale-110 transition-transform duration-300">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-display)]">
                Island<span className="gradient-text-purple">+</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { label: 'Explore', href: '/explore' },
                { label: 'Categories', href: '/explore?tab=categories' },
                { label: 'Live', href: '/explore?tab=live' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <Link
                href="/search"
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Search className="w-[18px] h-[18px]" />
              </Link>

              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/dashboard/notifications"
                    className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Bell className="w-[18px] h-[18px]" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-purple-neon rounded-full" />
                  </Link>
                  <Link
                    href="/dashboard/wallet"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-sm"
                  >
                    <Wallet className="w-4 h-4 text-purple-neon" />
                    <span className="text-white font-medium">${(Number(user.wallet_balance) || 0).toFixed(2)}</span>
                  </Link>
                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-purple-royal/50 hover:ring-purple-neon transition-all"
                    >
                      <img src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={user.display_name} className="w-full h-full object-cover" />
                    </button>
                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute right-0 top-12 w-56 glass-strong rounded-xl overflow-hidden shadow-xl shadow-black/50"
                        >
                          <div className="p-3 border-b border-white/5">
                            <p className="text-sm font-semibold text-white">{user.display_name}</p>
                            <p className="text-xs text-gray-400">@{user.username}</p>
                          </div>
                          <div className="p-1.5">
                            {[
                              { icon: User, label: 'Profile', href: '/dashboard/profile' },
                              { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet' },
                              { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
                            ].map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                onClick={() => setProfileOpen(false)}
                              >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                              </Link>
                            ))}
                            <button
                              onClick={() => { logout(); setProfileOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-all"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="hidden sm:block px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-full gradient-purple hover:opacity-90 transition-all glow-purple"
                  >
                    <Zap className="w-4 h-4" />
                    Join Free
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-20 glass-strong md:hidden"
          >
            <div className="p-6 space-y-2">
              {[
                { label: 'Explore', href: '/explore' },
                { label: 'Categories', href: '/explore?tab=categories' },
                { label: 'Live', href: '/explore?tab=live' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-lg text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 space-y-2">
                  <Link href="/login" className="block w-full text-center px-4 py-3 text-white border border-white/10 rounded-xl" onClick={() => setMobileOpen(false)}>
                    Log In
                  </Link>
                  <Link href="/register" className="block w-full text-center px-4 py-3 text-white gradient-purple rounded-xl font-semibold" onClick={() => setMobileOpen(false)}>
                    Join Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
