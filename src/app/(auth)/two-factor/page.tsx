'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function TwoFactorPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  
  const router = useRouter();
  const { login } = useAuthStore(); // Using login to bypass actual 2FA logic for prototype

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    // Handle paste
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedData[i] || '';
      }
      setCode(newCode);
      const nextEmptyIndex = newCode.findIndex(val => val === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
      inputRefs[focusIndex].current?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      
      // Auto advance
      if (value !== '' && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Log the user in (mock)
      await login('user@example.com', 'password');
      router.push('/dashboard/feed');
    } catch {
      setError('Invalid verification code. Please try again.');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card rounded-2xl p-8">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to login
        </Link>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-purple-royal/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-purple-neon" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Two-Factor Authentication</h1>
          <p className="text-sm text-gray-400">
            Enter the 6-digit code from your authenticator app to continue.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-black-surface border border-black-border text-white focus:border-purple-royal focus:ring-2 focus:ring-purple-royal/50 transition-all outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || code.join('').length < 6}
            className="w-full py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all glow-purple flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
