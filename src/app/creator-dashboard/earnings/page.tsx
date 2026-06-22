'use client';

import { motion } from 'framer-motion';
import { DollarSign, ArrowDownLeft, Wallet } from 'lucide-react';

export default function EarningsPage() {
  const payouts = [
    { id: 1, date: 'Oct 01, 2024', amount: '$3,450.00', status: 'Completed', method: 'Bank Transfer ending in 9012' },
    { id: 2, date: 'Sep 01, 2024', amount: '$2,890.50', status: 'Completed', method: 'Bank Transfer ending in 9012' },
    { id: 3, date: 'Aug 01, 2024', amount: '$3,120.00', status: 'Completed', method: 'Bank Transfer ending in 9012' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Earnings & Payouts</h1>
        <p className="text-sm text-gray-400">Track your revenue and manage your payout methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="gradient-purple rounded-2xl p-6 relative overflow-hidden glow-purple">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <DollarSign className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-white/80 mb-2">Available for Payout</h3>
            <div className="text-4xl font-bold text-white mb-6 font-[family-name:var(--font-display)]">$1,245.50</div>
            <button className="px-6 py-2.5 bg-white text-purple-royal rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Withdraw Funds
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Next Scheduled Payout</h3>
            <div className="text-2xl font-bold text-white font-[family-name:var(--font-display)] mb-1">Nov 01, 2024</div>
            <p className="text-sm text-gray-500">Auto-withdrawal enabled</p>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-4">
            <Wallet className="w-5 h-5 text-purple-neon" />
            <div>
              <p className="text-sm text-white font-medium">Bank ending in 9012</p>
              <button className="text-xs text-purple-neon hover:underline">Change payout method</button>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Payout History</h2>
        </div>
        <div className="divide-y divide-white/5">
          {payouts.map((payout) => (
            <div key={payout.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{payout.date}</p>
                  <p className="text-xs text-gray-500">{payout.method}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white">{payout.amount}</div>
                <div className="text-xs text-green-400">{payout.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
