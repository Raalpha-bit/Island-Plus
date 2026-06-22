'use client';

import { motion } from 'framer-motion';
import { Flag, ShieldAlert } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    { id: '1', reporter: 'user123', reportedContent: 'Post by @spam_bot', reason: 'Spam/Scam', status: 'Pending', date: '2 hrs ago' },
    { id: '2', reporter: 'jane_smith', reportedContent: 'Comment by @hater99', reason: 'Harassment', status: 'Pending', date: '5 hrs ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Content Moderation</h1>
        <p className="text-sm text-gray-400">Review user reports and moderate content.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Reported Content</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6 text-sm font-bold text-white">{report.reportedContent}</td>
                  <td className="p-4 text-sm text-red-400 font-medium">{report.reason}</td>
                  <td className="p-4 text-sm text-gray-400">@{report.reporter}</td>
                  <td className="p-4 text-sm text-gray-500">{report.date}</td>
                  <td className="p-4 pr-6 text-right">
                    <button className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors">
                      Review
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
