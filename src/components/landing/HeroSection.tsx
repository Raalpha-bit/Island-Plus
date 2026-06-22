'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-black-deep" />

      {/* Radial gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-royal/20 blur-[120px] animate-breathe" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-neon/15 blur-[100px] animate-breathe" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-dark/10 blur-[150px] animate-breathe" style={{ animationDelay: '1s' }} />

      {/* Particles */}
      <ParticleBackground />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(123, 46, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 46, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
        >
          <Sparkles className="w-4 h-4 text-purple-neon" />
          <span className="text-sm text-gray-300">The Caribbean Premium Creator Network</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6 font-[family-name:var(--font-display)]"
        >
          <span className="text-white">Enter The</span>
          <br />
          <span className="gradient-text-purple text-glow">Exclusive.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A private creator ecosystem where communities thrive.
          <br className="hidden sm:block" />
          Unlock exclusive content, join elite communities, and support your favorite creators.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/explore"
            className="group flex items-center gap-2 px-8 py-4 rounded-full gradient-purple text-white font-semibold text-lg glow-purple hover:glow-purple-strong transition-all duration-500 hover:scale-105"
          >
            Explore Creators
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/register?role=creator"
            className="group flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white font-semibold text-lg hover:bg-white/5 hover:border-purple-royal/50 transition-all duration-500"
          >
            <Play className="w-5 h-5 text-purple-neon" />
            Become A Creator
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 flex items-center justify-center gap-6 sm:gap-10 text-gray-600 text-sm"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Secure & Encrypted
          </span>
          <span>18+ Only</span>
          <span>Creator First</span>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black-deep to-transparent z-10" />
    </section>
  );
}
