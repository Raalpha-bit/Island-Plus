'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, History, Plus, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Api } from '@/lib/api';

export default function WalletPage() {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsLoading(true);
        const data = await Api.get<any[]>('/transactions');
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load transaction history.');
      } finally {
        setIsLoading(false);
      }
    }
    loadTransactions();
  }, []);

  // Calculate spent this month
  const spentThisMonth = transactions
    .filter(tx => {
      if (tx.user_id !== user?.id) return false; // Received tips/payouts are not spent
      const txDate = new Date(tx.created_at);
      const now = new Date();
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  // Count active subscriptions
  const activeSubsCount = transactions.filter(tx => tx.type === 'subscription' && tx.status === 'completed').length;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
      </div>
    );
  }

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

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="md:col-span-2 gradient-purple rounded-2xl p-8 relative overflow-hidden glow-purple">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Wallet className="w-32 h-32 text-white transform rotate-12" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-white/80 mb-2">Available Balance</h3>
            <div className="text-5xl font-bold text-white mb-8 font-[family-name:var(--font-display)]">
              ${(Number(user?.wallet_balance) || 0).toFixed(2)}
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-royal rounded-xl font-bold hover:bg-gray-100 transition-colors cursor-pointer">
                <Plus className="w-5 h-5" /> Add Funds
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-black/20 text-white rounded-xl font-bold hover:bg-black/30 transition-colors backdrop-blur-md cursor-pointer">
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
              <p className="text-xl font-bold text-white">${spentThisMonth.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Total transactions</p>
              <p className="text-xl font-bold text-white">{transactions.length}</p>
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
        
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No transactions found.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => {
              const isOutgoing = tx.user_id === user?.id;
              const displayAmount = Number(tx.amount);
              return (
                <div key={tx.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      !isOutgoing ? 'bg-green-500/20' : 'bg-white/10'
                    }`}>
                      {!isOutgoing ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.description || `${tx.type.toUpperCase()} transaction`}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${!isOutgoing ? 'text-green-500' : 'text-white'}`}>
                    {!isOutgoing ? '+' : '-'}${displayAmount.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
