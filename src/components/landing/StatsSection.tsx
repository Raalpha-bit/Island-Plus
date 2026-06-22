'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Camera, Radio, Crown } from 'lucide-react';

function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  const format = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
    return n.toLocaleString();
  };

  return <span ref={ref}>{format(count)}{suffix}</span>;
}

export default function StatsSection() {
  const stats = [
    { icon: Crown, label: 'Total Creators', value: 15200, suffix: '+', color: 'from-purple-royal to-purple-neon' },
    { icon: Users, label: 'Total Members', value: 2800000, suffix: '+', color: 'from-purple-neon to-purple-light' },
    { icon: Camera, label: 'Total Content', value: 12500000, suffix: '+', color: 'from-purple-light to-pink-500' },
    { icon: Radio, label: 'Live Streams', value: 3400, suffix: '+', color: 'from-pink-500 to-purple-royal' },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-purple-royal/5 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 sm:p-8 text-center group hover:scale-[1.02] transition-transform duration-500"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1 font-[family-name:var(--font-display)]">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
