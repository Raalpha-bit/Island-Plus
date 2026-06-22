'use client';

import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, UserCheck, Star } from 'lucide-react';

export default function SubscribersPage() {
  const subscribers = [
    { id: 1, username: 'alex_r', name: 'Alex R.', tier: 'Black', joinDate: 'Oct 15, 2024', status: 'Active', spend: '$149.97' },
    { id: 2, username: 'sarah_k', name: 'Sarah K.', tier: 'Gold', joinDate: 'Oct 10, 2024', status: 'Active', spend: '$39.98' },
    { id: 3, username: 'mike_t', name: 'Mike T.', tier: 'Silver', joinDate: 'Sep 28, 2024', status: 'Active', spend: '$19.98' },
    { id: 4, username: 'jess_m', name: 'Jessica M.', tier: 'Bronze', joinDate: 'Sep 15, 2024', status: 'Expired', spend: '$4.99' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Subscribers</h1>
          <p className="text-sm text-gray-400">Manage your active and past subscribers.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-black-surface border border-black-border text-sm text-white focus:border-purple-royal outline-none" />
          </div>
          <button className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Status</th>
                <th className="p-4 hidden sm:table-cell">Join Date</th>
                <th className="p-4 hidden md:table-cell">Total Spend</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-royal/20 flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-purple-neon" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{sub.name}</p>
                        <p className="text-xs text-gray-500">@{sub.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-sm text-white">
                      {sub.tier === 'Black' && <Star className="w-3.5 h-3.5 text-purple-neon fill-purple-neon" />}
                      {sub.tier}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                      sub.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-sm text-gray-400">{sub.joinDate}</td>
                  <td className="p-4 hidden md:table-cell text-sm text-gray-400">{sub.spend}</td>
                  <td className="p-4 pr-6 text-right">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-5 h-5 ml-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
