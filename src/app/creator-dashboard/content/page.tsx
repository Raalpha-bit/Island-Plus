'use client';

import { motion } from 'framer-motion';
import { Plus, Image as ImageIcon, Video, MoreHorizontal, Lock, Eye } from 'lucide-react';

export default function ContentPage() {
  const content = [
    { id: 1, title: 'Maldives VLOG #1', type: 'video', date: 'Oct 24, 2024', views: '2.4K', likes: 342, status: 'Published', visibility: 'Subscribers Only' },
    { id: 2, title: 'Summer Collection Preview', type: 'image', date: 'Oct 22, 2024', views: '5.1K', likes: 890, status: 'Published', visibility: 'Public' },
    { id: 3, title: 'Behind the Scenes', type: 'video', date: 'Oct 20, 2024', views: '1.2K', likes: 156, status: 'Draft', visibility: 'Gold Tier+' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Content Management</h1>
          <p className="text-sm text-gray-400">Upload and manage your exclusive content.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 transition-all glow-purple">
          <Plus className="w-5 h-5" /> New Post
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div className="col-span-5 sm:col-span-4">Content</div>
          <div className="col-span-3 hidden sm:block">Visibility</div>
          <div className="col-span-3 hidden md:block">Stats</div>
          <div className="col-span-4 sm:col-span-2 text-right">Status</div>
          <div className="col-span-3 sm:col-span-3 md:col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/5">
          {content.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
              <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black-surface flex items-center justify-center shrink-0">
                  {item.type === 'video' ? <Video className="w-5 h-5 text-purple-neon" /> : <ImageIcon className="w-5 h-5 text-purple-neon" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
              
              <div className="col-span-3 hidden sm:flex items-center gap-1.5">
                {item.visibility === 'Public' ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <Lock className="w-3.5 h-3.5 text-purple-neon" />}
                <span className="text-sm text-gray-300">{item.visibility}</span>
              </div>

              <div className="col-span-3 hidden md:flex items-center gap-4 text-sm text-gray-300">
                <span>{item.views} views</span>
                <span>{item.likes} likes</span>
              </div>

              <div className="col-span-4 sm:col-span-2 text-right">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="col-span-3 sm:col-span-3 md:col-span-1 text-right">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5 ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
