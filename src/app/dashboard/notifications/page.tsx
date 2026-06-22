'use client';

import { motion } from 'framer-motion';
import { Bell, Heart, MessageCircle, Star, Image as ImageIcon } from 'lucide-react';
import { creators } from '@/lib/mock/creators';

export default function NotificationsPage() {
  const notifications = [
    { id: '1', type: 'like', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/20', content: '@islandqueen liked your comment.', time: '2m ago', unread: true },
    { id: '2', type: 'message', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/20', content: 'You have a new message from @fitking_marcus.', time: '1h ago', unread: true },
    { id: '3', type: 'post', icon: ImageIcon, color: 'text-purple-neon', bg: 'bg-purple-neon/20', content: '@lens_sofia posted a new exclusive gallery.', time: '3h ago', unread: false },
    { id: '4', type: 'subscribe', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/20', content: 'Your subscription to @dj_nova renewed successfully.', time: '1d ago', unread: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Notifications</h1>
          <p className="text-sm text-gray-400">Stay updated on latest activity.</p>
        </div>
        <button className="text-sm text-purple-neon hover:underline">Mark all as read</button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-4 sm:p-6 flex items-start gap-4 transition-colors ${notif.unread ? 'bg-white/5' : 'hover:bg-white/[0.02]'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg}`}>
              <notif.icon className={`w-5 h-5 ${notif.color}`} />
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm text-gray-200">{notif.content}</p>
              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
            </div>
            {notif.unread && (
              <div className="w-2 h-2 rounded-full bg-purple-neon shrink-0 mt-2" />
            )}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
            No new notifications.
          </div>
        )}
      </div>
    </motion.div>
  );
}
