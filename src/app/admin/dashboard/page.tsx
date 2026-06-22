'use client';

import { motion } from 'framer-motion';
import { DollarSign, Users, ShieldAlert, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const data = [
    { name: 'Mon', revenue: 40000 },
    { name: 'Tue', revenue: 30000 },
    { name: 'Wed', revenue: 55000 },
    { name: 'Thu', revenue: 45000 },
    { name: 'Fri', revenue: 60000 },
    { name: 'Sat', revenue: 80000 },
    { name: 'Sun', revenue: 95000 },
  ];

  const stats = [
    { title: 'Platform Revenue (Monthly)', value: '$2.4M', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/20' },
    { title: 'Total Active Users', value: '2.8M', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/20' },
    { title: 'Active Creators', value: '15.2K', icon: TrendingUp, color: 'text-purple-neon', bg: 'bg-purple-neon/20' },
    { title: 'Open Reports', value: '142', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/20' },
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
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(123,46,255,0.2)', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="revenue" stroke="#34C759" strokeWidth={3} dot={{ r: 4, fill: '#34C759', strokeWidth: 2, stroke: '#050505' }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
