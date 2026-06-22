'use client';

import { motion } from 'framer-motion';
import { Users, DollarSign, Eye, TrendingUp, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OverviewPage() {
  const data = [
    { name: 'Mon', revenue: 400, views: 2400 },
    { name: 'Tue', revenue: 300, views: 1398 },
    { name: 'Wed', revenue: 550, views: 9800 },
    { name: 'Thu', revenue: 450, views: 3908 },
    { name: 'Fri', revenue: 600, views: 4800 },
    { name: 'Sat', revenue: 800, views: 3800 },
    { name: 'Sun', revenue: 950, views: 4300 },
  ];

  const stats = [
    { title: 'Total Revenue', value: '$4,050.00', icon: DollarSign, trend: '+12.5%', color: 'from-purple-royal to-purple-neon' },
    { title: 'Active Subscribers', value: '1,245', icon: Users, trend: '+5.2%', color: 'from-blue-500 to-blue-400' },
    { title: 'Profile Views', value: '45.2K', icon: Eye, trend: '+18.1%', color: 'from-pink-500 to-pink-400' },
    { title: 'Conversion Rate', value: '3.4%', icon: TrendingUp, trend: '+1.2%', color: 'from-green-500 to-green-400' },
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
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-royal/20 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-purple-neon" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">New subscriber (Gold)</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
                <span className="text-sm font-bold text-green-400">+$19.99</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-purple-neon hover:text-purple-light transition-colors text-center font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </motion.div>
  );
}
