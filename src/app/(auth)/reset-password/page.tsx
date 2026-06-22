'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

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
              <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Create New Password</h1>
              <p className="text-sm text-gray-400">Your new password must be different from previous used passwords.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-black-surface border border-black-border text-white placeholder:text-gray-600 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black-surface border border-black-border text-white placeholder:text-gray-600 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all glow-purple flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Password Reset Successfully</h2>
            <p className="text-sm text-gray-400 mb-8">
              Your password has been reset successfully. You can now use your new password to log in.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 transition-all glow-purple"
            >
              Go to Login
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
