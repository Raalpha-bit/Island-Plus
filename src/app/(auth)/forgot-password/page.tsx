'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card rounded-2xl p-8">
        {!isSuccess ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Reset Password</h1>
              <p className="text-sm text-gray-400">Enter your email to receive a reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all glow-purple flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-purple-royal/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-purple-neon" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-sm text-gray-400 mb-8">
              We've sent a password reset link to <br />
              <span className="text-white font-medium">{email}</span>
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
            >
              Return to Login <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>

      {!isSuccess && (
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{' '}
          <Link href="/login" className="text-purple-neon hover:underline font-medium">Sign in</Link>
        </p>
      )}
    </motion.div>
  );
}
