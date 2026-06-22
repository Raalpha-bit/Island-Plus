'use client';

import { motion } from 'framer-motion';
import { Video, Play, Settings } from 'lucide-react';

export default function LiveStreamPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Live Studio</h1>
        <p className="text-sm text-gray-400">Go live for your subscribers or schedule an upcoming stream.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="aspect-video bg-black-surface rounded-xl flex flex-col items-center justify-center border border-dashed border-white/20 mb-6 relative overflow-hidden group">
            <Video className="w-12 h-12 text-gray-500 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-gray-400 font-medium">Camera Preview Offline</p>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 py-3 rounded-xl gradient-purple text-white font-bold hover:opacity-90 transition-all glow-purple flex items-center justify-center gap-2">
              <Play className="w-5 h-5 fill-white" /> Go Live Now
            </button>
            <button className="px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
              <Settings className="w-5 h-5" /> Stream Setup
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Stream Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Stream Title</label>
                <input type="text" placeholder="E.g., Q&A Session!" className="w-full px-4 py-2.5 rounded-xl bg-black-surface border border-black-border text-white focus:border-purple-royal outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Visibility</label>
                <select className="w-full px-4 py-2.5 rounded-xl bg-black-surface border border-black-border text-white focus:border-purple-royal outline-none appearance-none">
                  <option>All Subscribers</option>
                  <option>Gold Tier & Above</option>
                  <option>Black Tier Only</option>
                  <option>Public (Free)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
