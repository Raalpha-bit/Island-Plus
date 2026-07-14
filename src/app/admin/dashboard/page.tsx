'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, ShieldAlert, TrendingUp, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Api } from '@/lib/api';

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const data = await Api.get<any>('/admin/stats');
        setStatsData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load platform stats.');
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
      </div>
    );
  }

  const stats = [
    { title: 'Platform Revenue', value: `$${(statsData?.totalPlatformRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/20' },
    { title: 'Total Registered Users', value: (statsData?.totalUsers || 0).toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/20' },
    { title: 'Approved Creators', value: (statsData?.totalCreators || 0).toLocaleString(), icon: TrendingUp, color: 'text-purple-neon', bg: 'bg-purple-neon/20' },
    { title: 'Pending Withdrawals', value: (statsData?.openWithdrawals || 0).toLocaleString(), icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/20' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Platform Overview</h1>
        <p className="text-sm text-gray-400">High-level metrics and system status.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-6">Revenue Growth (Last 7 Days)</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statsData?.chartData || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(123,46,255,0.2)', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="revenue" stroke="#34C759" strokeWidth={3} dot={{ r: 4, fill: '#34C759', strokeWidth: 2, stroke: '#050505' }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
