'use client';

import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';

export default function VerificationPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Verification Queue</h1>
        <p className="text-sm text-gray-400">Review creator KYC and ID verification requests.</p>
      </div>

      <div className="glass-card rounded-2xl p-12 text-center text-gray-400">
        <CheckSquare className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Queue is empty</h3>
        <p className="text-sm">All identity verifications have been processed.</p>
      </div>
    </motion.div>
  );
}
