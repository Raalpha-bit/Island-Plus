'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Calendar, Loader2, ArrowRight, Shield, Zap } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

import { Suspense } from 'react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'creator' ? 'creator' : 'member';

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'member' | 'creator'>(initialRole);
  
  // Form Data
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!email || !username || !password) {
        setError('Please fill in all fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!dob) {
        setError('Please enter your date of birth.');
        return;
      }

      // Age verification
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        setError('This platform is strictly reserved for adults aged 18 and older.');
        return;
      }

      submitRegistration();
    }
  };

  const submitRegistration = async () => {
    try {
      await register({ email, username, password, dob });
      router.push('/verify-email');
    } catch {
      setError('An error occurred during registration. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Join Island+</h1>
          <p className="text-sm text-gray-400">
            {role === 'creator' ? 'Start earning from your content today.' : 'Unlock exclusive creator content.'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 mb-6 rounded-xl bg-black-surface border border-white/5">
          <button
            type="button"
            onClick={() => setRole('member')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === 'member' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Member
          </button>
          <button
            type="button"
            onClick={() => setRole('creator')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-all ${
              role === 'creator' ? 'bg-white/10 text-purple-neon shadow-sm' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Creator
          </button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleNextStep} className="space-y-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black-surface border border-black-border text-white placeholder:text-gray-600 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="username"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black-surface border border-black-border text-white placeholder:text-gray-600 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black-surface border border-black-border text-white placeholder:text-gray-600 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 transition-all glow-purple flex items-center justify-center gap-2 mt-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-xl bg-purple-royal/10 border border-purple-royal/20 mb-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-neon flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Island+ is a strictly 18+ platform. You must verify your age to continue.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black-surface border border-black-border text-white focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all glow-purple flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-purple-neon hover:underline font-medium">Sign in</Link>
      </p>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-purple-neon" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
