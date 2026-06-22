'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const data = [
    { name: '18-24', male: 4000, female: 2400 },
    { name: '25-34', male: 3000, female: 1398 },
    { name: '35-44', male: 2000, female: 9800 },
    { name: '45-54', male: 2780, female: 3908 },
    { name: '55+', male: 1890, female: 4800 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Analytics</h1>
        <p className="text-sm text-gray-400">Deep dive into your audience metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Audience Demographics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111118', border: '1px solid rgba(123,46,255,0.2)', borderRadius: '12px' }} />
                <Bar dataKey="female" stackId="a" fill="#A855F7" radius={[0, 0, 4, 4]} />
                <Bar dataKey="male" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Top Locations</h3>
          <div className="space-y-4">
            {[
              { country: 'United States', percentage: 45, value: '12.4K' },
              { country: 'United Kingdom', percentage: 25, value: '6.8K' },
              { country: 'Canada', percentage: 15, value: '4.1K' },
              { country: 'Australia', percentage: 10, value: '2.7K' },
              { country: 'Germany', percentage: 5, value: '1.3K' },
            ].map((loc, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{loc.country}</span>
                  <span className="text-white font-medium">{loc.value}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-neon rounded-full" style={{ width: `${loc.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
