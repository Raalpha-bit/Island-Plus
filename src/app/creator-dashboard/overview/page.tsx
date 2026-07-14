'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Eye, Heart, ArrowUpRight, Loader2, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Api } from '@/lib/api';

export default function OverviewPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true);
        const data = await Api.get<any>('/creator/analytics');
        setAnalytics(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics.');
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
      </div>
    );
  }

  const stats = [
    { title: 'Total Revenue', value: `$${(analytics?.stats?.totalEarnings || 0).toFixed(2)}`, icon: DollarSign, trend: '+12.5%', color: 'from-purple-royal to-purple-neon' },
    { title: 'Active Subscribers', value: (analytics?.stats?.activeSubscribers || 0).toLocaleString(), icon: Users, trend: '+5.2%', color: 'from-blue-500 to-blue-400' },
    { title: 'Profile Views', value: (analytics?.stats?.profileViews || 0).toLocaleString(), icon: Eye, trend: '+18.1%', color: 'from-pink-500 to-pink-400' },
    { title: 'Total Likes', value: (analytics?.stats?.likes || 0).toLocaleString(), icon: Heart, trend: '+4.3%', color: 'from-green-500 to-green-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Dashboard Overview</h1>
        <p className="text-sm text-gray-400">Welcome back. Here's what's happening with your account today.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" /> {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Revenue & Views</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.chartData || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(123,46,255,0.2)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#A855F7" strokeWidth={3} dot={{ r: 4, fill: '#A855F7', strokeWidth: 2, stroke: '#050505' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line yAxisId="right" type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#050505' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
          
          {(!analytics?.notifications || analytics.notifications.length === 0) ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No recent activity.
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.notifications.map((notif: any) => (
                <div key={notif.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-royal/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4 text-purple-neon" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{notif.title}</p>
                    <p className="text-xs text-gray-400 leading-snug mt-0.5">{notif.body}</p>
                    <p className="text-[10px] text-gray-600 mt-1">{new Date(notif.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
