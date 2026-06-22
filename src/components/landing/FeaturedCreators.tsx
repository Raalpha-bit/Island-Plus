'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Users, Radio } from 'lucide-react';
import { creators } from '@/lib/mock/creators';

export default function FeaturedCreators() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-[family-name:var(--font-display)]">
            Featured <span className="gradient-text-purple">Creators</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Discover the most popular creators on Island+. Subscribe to unlock their exclusive worlds.
          </p>
        </motion.div>

        {/* Creator Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {creators.slice(0, 8).map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/creator/${creator.username}`} className="block group">
                <div className="glass-card rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-500">
                  {/* Cover */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={creator.cover}
                      alt={creator.displayName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black-card to-transparent" />
                    {creator.isLive && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/90 text-xs font-semibold text-white backdrop-blur-sm">
                        <Radio className="w-3 h-3 animate-pulse" />
                        LIVE
                      </div>
                    )}
                  </div>

                  {/* Profile */}
                  <div className="relative px-4 pb-4">
                    {/* Avatar */}
                    <div className="relative -mt-8 mb-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-black-card">
                        <img
                          src={creator.avatar}
                          alt={creator.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {creator.isOnline && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 ring-2 ring-black-card" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">{creator.displayName}</h3>
                      {creator.verified && (
                        <CheckCircle className="w-4 h-4 text-purple-neon flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-3">@{creator.username}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {(creator.followers / 1000).toFixed(0)}K
                      </span>
                      <span>{creator.posts} posts</span>
                    </div>

                    {/* Subscribe Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{creator.category}</span>
                      <span className="px-3 py-1.5 rounded-full gradient-purple text-xs font-semibold text-white">
                        ${creator.subscriptionPrice}/mo
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-sm text-gray-300 hover:text-white hover:border-purple-royal/50 transition-all duration-300"
          >
            View All Creators
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
