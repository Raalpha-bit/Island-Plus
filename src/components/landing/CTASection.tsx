'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-royal/50 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-royal/15 blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-neon/10 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-display)]">
            Ready to{' '}
            <span className="gradient-text-purple text-glow">Enter?</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join Island+ today and become part of the most exclusive creator community in the Caribbean and beyond.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 rounded-full gradient-purple text-white font-semibold text-lg glow-purple hover:glow-purple-strong transition-all duration-500 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-all duration-300"
            >
              Browse Creators
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-purple-neon" />
              End-to-end encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-purple-neon" />
              DMCA protected
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
