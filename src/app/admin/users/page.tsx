'use client';

import { motion } from 'framer-motion';
import { Search, Filter, ShieldAlert, MoreHorizontal } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Member', status: 'Active', joined: 'Oct 24, 2024' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Member', status: 'Suspended', joined: 'Oct 20, 2024' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">User Management</h1>
          <p className="text-sm text-gray-400">Manage all registered members.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search users by email..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-black-surface border border-black-border text-sm text-white focus:border-purple-royal outline-none" />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6 text-sm font-bold text-white">{user.name}</td>
                  <td className="p-4 text-sm text-gray-400">{user.email}</td>
                  <td className="p-4 text-sm text-gray-400">{user.role}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
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
