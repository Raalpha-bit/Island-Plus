'use client';

import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, History, Plus } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function WalletPage() {
  const { user } = useAuthStore();

  const transactions = [
    { id: '1', type: 'subscription', amount: -19.99, date: 'Today', description: 'Gold Tier - @islandqueen' },
    { id: '2', type: 'deposit', amount: 50.00, date: 'Yesterday', description: 'Added funds via Card ending in 4242' },
    { id: '3', type: 'tip', amount: -5.00, date: 'Oct 12', description: 'Tip to @fitking_marcus' },
    { id: '4', type: 'content', amount: -12.50, date: 'Oct 10', description: 'Unlocked PPV - @lens_sofia' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Digital Wallet</h1>
        <p className="text-sm text-gray-400">Manage your balance and transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="md:col-span-2 gradient-purple rounded-2xl p-8 relative overflow-hidden glow-purple">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Wallet className="w-32 h-32 text-white transform rotate-12" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-white/80 mb-2">Available Balance</h3>
            <div className="text-5xl font-bold text-white mb-8 font-[family-name:var(--font-display)]">
              ${user?.walletBalance.toFixed(2) || '0.00'}
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-royal rounded-xl font-bold hover:bg-gray-100 transition-colors">
                <Plus className="w-5 h-5" /> Add Funds
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-black/20 text-white rounded-xl font-bold hover:bg-black/30 transition-colors backdrop-blur-md">
                <CreditCard className="w-5 h-5" /> Manage Cards
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Spent this month</p>
              <p className="text-xl font-bold text-white">$142.50</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Active Subscriptions</p>
              <p className="text-xl font-bold text-white">4</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-royal/20 flex items-center justify-center">
              <History className="w-5 h-5 text-purple-neon" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-white/5">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.amount > 0 ? 'bg-green-500/20' : 'bg-white/10'
                }`}>
                  {tx.amount > 0 ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <div className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
