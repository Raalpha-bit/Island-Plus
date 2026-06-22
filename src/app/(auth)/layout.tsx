'use client';

import { Crown } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black-deep" />
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] rounded-full bg-purple-royal/20 blur-[120px] animate-breathe" />
      <div className="absolute bottom-1/4 -right-20 w-[350px] h-[350px] rounded-full bg-purple-neon/15 blur-[100px] animate-breathe" style={{ animationDelay: '2s' }} />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(123,46,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(123,46,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-12">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center glow-purple">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold font-[family-name:var(--font-display)]">
            Island<span className="gradient-text-purple">+</span>
          </span>
        </Link>

        {children}

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-8">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-purple-neon hover:underline">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-purple-neon hover:underline">Privacy Policy</Link>.
          <br />18+ only platform.
        </p>
      </div>
    </div>
  );
}
