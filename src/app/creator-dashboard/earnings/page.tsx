'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ArrowDownLeft, Wallet, Loader2, X, AlertCircle } from 'lucide-react';
import { Api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function EarningsPage() {
  const { user, fetchProfile } = useAuthStore();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Payout dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const loadPayouts = async () => {
    try {
      setIsLoading(true);
      const data = await Api.get<any[]>('/creator/payouts');
      setPayouts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load payout history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, []);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setModalError('Please enter a valid amount.');
      return;
    }
    if (amt > (user?.wallet_balance || 0)) {
      setModalError('Amount exceeds available balance.');
      return;
    }

    try {
      setIsSubmitting(true);
      await Api.post('/creator/payouts', { amount: amt });
      setWithdrawAmount('');
      setIsModalOpen(false);
      
      // Refresh balance and list
      await fetchProfile();
      await loadPayouts();
    } catch (err: any) {
      setModalError(err.message || 'Failed to request payout.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Earnings & Payouts</h1>
        <p className="text-sm text-gray-400">Track your revenue and manage your payout methods.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Available Balance Card */}
        <div className="gradient-purple rounded-2xl p-6 relative overflow-hidden glow-purple">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <DollarSign className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-white/80 mb-2">Available for Payout</h3>
            <div className="text-4xl font-bold text-white mb-6 font-[family-name:var(--font-display)]">
              ${(Number(user?.wallet_balance) || 0).toFixed(2)}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-white text-purple-royal rounded-xl font-bold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Scheduled Payouts Info */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Scheduled Payouts</h3>
            <div className="text-2xl font-bold text-white font-[family-name:var(--font-display)] mb-1">Weekly Auto-payout</div>
            <p className="text-sm text-gray-500">Auto-withdrawal to bank account enabled</p>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-4">
            <Wallet className="w-5 h-5 text-purple-neon" />
            <div>
              <p className="text-sm text-white font-medium">Stripe Connected Express Account</p>
              <p className="text-xs text-gray-500">Auto-settles in 2-3 business days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Payout History</h2>
        </div>
        
        {payouts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No payouts requested yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {payouts.map((payout) => (
              <div key={payout.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <ArrowDownLeft className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{new Date(payout.created_at).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">Stripe express bank payout</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">${Number(payout.amount).toFixed(2)}</div>
                  <div className={`text-xs capitalize font-medium ${
                    payout.status === 'completed' ? 'text-green-400' :
                    payout.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {payout.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass-card rounded-2xl p-6 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Withdraw Funds</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                {modalError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Amount to Withdraw</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-black-surface border border-black-border text-white placeholder:text-gray-600 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Available balance: ${(user?.wallet_balance || 0).toFixed(2)}</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all glow-purple flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
