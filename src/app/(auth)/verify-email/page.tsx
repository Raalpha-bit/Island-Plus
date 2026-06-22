'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResend = async () => {
    setIsResending(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsResending(false);
    setCanResend(false);
    setCountdown(60);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-royal/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-purple-neon" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Verify Your Email</h1>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={!canResend || isResending}
            className="w-full py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isResending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                {canResend ? 'Resend Email' : `Resend available in ${countdown}s`}
              </>
            )}
          </button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Return to Login <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
