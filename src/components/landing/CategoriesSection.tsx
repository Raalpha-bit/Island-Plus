'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { categories } from '@/lib/mock/creators';

export default function CategoriesSection() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-[family-name:var(--font-display)]">
            Browse <span className="gradient-text-purple">Categories</span>
          </h2>
          <p className="text-gray-400">Find creators in the categories you love.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/explore?category=${cat.name}`}
                className="block glass-card rounded-2xl p-6 text-center group hover:scale-[1.04] hover:border-purple-royal/40 transition-all duration-500"
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-500">
                  {cat.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.count.toLocaleString()} creators</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
