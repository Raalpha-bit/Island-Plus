'use client';

import { motion } from 'framer-motion';

export default function CreatorSettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Creator Settings</h1>
        <p className="text-sm text-gray-400">Manage your creator profile and platform preferences.</p>
      </div>

      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Subscription Tiers</h2>
          <p className="text-sm text-gray-400 mb-6">Configure your subscription pricing. Note: Changing prices only affects new subscribers.</p>
          
          <div className="space-y-4">
            {['Bronze', 'Silver', 'Gold', 'Black'].map((tier) => (
              <div key={tier} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black-surface">
                <div>
                  <h3 className="font-bold text-white">{tier} Tier</h3>
                  <p className="text-xs text-gray-500">Active subscribers: 0</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">$</span>
                  <input type="number" defaultValue={tier === 'Black' ? 49.99 : 9.99} className="w-20 px-3 py-1.5 rounded-lg bg-black-deep border border-black-border text-white outline-none focus:border-purple-royal" />
                  <span className="text-sm text-gray-400">/mo</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2.5 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 transition-all glow-purple">
              Save Pricing
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
