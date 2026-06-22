'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/lib/mock/creators';

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-royal/5 blur-[100px] rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-[family-name:var(--font-display)]">
            What People <span className="gradient-text-purple">Say</span>
          </h2>
          <p className="text-gray-400">Join thousands of creators and members who love Island+.</p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-8 sm:p-12 text-center"
            >
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-8 italic">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-3">
                <img
                  src={testimonials[current].avatar}
                  alt={testimonials[current].name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-royal/30"
                />
                <div className="text-left">
                  <p className="text-white font-semibold">{testimonials[current].name}</p>
                  <p className="text-sm text-purple-neon">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-royal/40 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-purple-neon w-6' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-royal/40 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
