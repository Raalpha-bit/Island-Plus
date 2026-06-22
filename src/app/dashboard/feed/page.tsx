'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { creators } from '@/lib/mock/creators';

export default function FeedPage() {
  // Mock feed data
  const feedPosts = [
    {
      id: '1',
      creator: creators[0],
      content: 'Just dropped a new exclusive gallery from my trip to the Maldives! 🌴✨',
      image: creators[0].previewImages[0],
      likes: 3420,
      comments: 128,
      time: '2 hours ago',
    },
    {
      id: '2',
      creator: creators[2],
      content: 'Behind the scenes of today\'s photoshoot. Subscribers get the raw cuts! 📸',
      image: creators[2].previewImages[0],
      likes: 5120,
      comments: 342,
      time: '5 hours ago',
    },
    {
      id: '3',
      creator: creators[1],
      content: 'New 30-day shredded program is now live for Gold & Black tier members! 💪 Let\'s get to work.',
      image: null,
      likes: 1205,
      comments: 89,
      time: '1 day ago',
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Your Feed</h1>
        <p className="text-sm text-gray-400">Latest updates from creators you subscribe to.</p>
      </div>

      {/* Stories Bar */}
      <div className="flex gap-4 overflow-x-auto pb-6 mb-6 no-scrollbar">
        {creators.map((creator, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer">
            <div className={`w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr ${i % 2 === 0 ? 'from-purple-neon to-pink-500' : 'from-gray-700 to-gray-500'}`}>
              <div className="w-full h-full rounded-full border-2 border-black-deep overflow-hidden">
                <img src={creator.avatar} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs text-gray-400 w-16 truncate text-center">{creator.username}</span>
          </div>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {feedPosts.map((post) => (
          <div key={post.id} className="glass-card rounded-2xl overflow-hidden">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.creator.avatar} alt={post.creator.displayName} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-royal/30" />
                <div>
                  <h3 className="text-sm font-bold text-white">{post.creator.displayName}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>@{post.creator.username}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-sm text-gray-200">{post.content}</p>
            </div>

            {/* Post Image */}
            {post.image && (
              <div className="relative w-full aspect-[4/5] sm:aspect-video bg-black-surface">
                <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Post Actions */}
            <div className="p-4 flex items-center justify-between border-t border-white/5 mt-2">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors group">
                  <Heart className="w-5 h-5 group-hover:fill-pink-500" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-purple-neon transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
