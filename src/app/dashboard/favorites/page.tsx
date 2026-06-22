'use client';

import { motion } from 'framer-motion';
import { creators } from '@/lib/mock/creators';
import Link from 'next/link';

export default function FavoritesPage() {
  const favoriteCreators = creators.slice(0, 3); // Mock favorites

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Favorites</h1>
        <p className="text-sm text-gray-400">Creators you've bookmarked for later.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favoriteCreators.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link href={`/creator/${creator.username}`} className="block group">
              <div className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
                <div className="h-24 overflow-hidden">
                  <img src={creator.cover} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="px-4 pb-4 -mt-8 flex flex-col items-center text-center">
                  <img src={creator.avatar} alt={creator.displayName} className="w-16 h-16 rounded-full object-cover ring-4 ring-black-card mb-2" />
                  <h3 className="font-bold text-white">{creator.displayName}</h3>
                  <p className="text-xs text-gray-400 mb-3">@{creator.username}</p>
                  <button className="w-full py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
