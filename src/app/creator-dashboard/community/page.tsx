'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Plus } from 'lucide-react';

export default function CommunityPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Community Hub</h1>
          <p className="text-sm text-gray-400">Engage with your subscribers via posts and polls.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 transition-all glow-purple">
          <Plus className="w-5 h-5" /> New Announcement
        </button>
      </div>

      <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-white/20">
        <MessageSquare className="w-12 h-12 text-purple-neon mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-white mb-2">No community posts yet</h3>
        <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
          Start building your community by posting announcements, asking questions, or sharing exclusive updates.
        </p>
        <button className="px-6 py-2.5 rounded-xl border border-purple-neon text-purple-neon font-semibold hover:bg-purple-neon/10 transition-colors">
          Create First Post
        </button>
      </div>
    </motion.div>
  );
}
