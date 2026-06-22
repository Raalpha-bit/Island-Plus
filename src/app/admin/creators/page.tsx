'use client';

import { motion } from 'framer-motion';

export default function CreatorsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Creator Management</h1>
        <p className="text-sm text-gray-400">View and manage verified creators.</p>
      </div>
      <div className="glass-card rounded-2xl p-12 text-center text-gray-400">
        Creator management table will be implemented here. Similar to Users page but with revenue metrics.
      </div>
    </motion.div>
  );
}
