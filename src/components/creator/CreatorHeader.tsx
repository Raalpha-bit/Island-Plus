'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle, Share2, MoreHorizontal, Users, Radio, Lock } from 'lucide-react';
import { creators } from '@/lib/mock/creators';

export default function CreatorHeader({ username }: { username: string }) {
  const pathname = usePathname();
  const creator = creators.find(c => c.username === username) || creators[0]; // fallback for demo
  const [isFollowing, setIsFollowing] = useState(false);

  const tabs = [
    { label: 'Home', href: `/creator/${username}/home` },
    { label: 'Preview', href: `/creator/${username}/preview` },
    { label: 'Community', href: `/creator/${username}/community`, locked: true },
    { label: 'Videos', href: `/creator/${username}/videos`, locked: true },
    { label: 'Live', href: `/creator/${username}/live`, locked: true },
    { label: 'About', href: `/creator/${username}/about` },
  ];

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
        <img
          src={creator.cover}
          alt={creator.displayName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-black-deep/40 to-transparent" />
        
        {creator.isLive && (
          <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/90 text-sm font-semibold text-white backdrop-blur-sm z-10">
            <Radio className="w-4 h-4 animate-pulse" />
            LIVE NOW
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-20 md:-mt-24 mb-8">
          {/* Avatar */}
          <div className="relative shrink-0 self-start md:self-auto">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-black-deep">
              <img
                src={creator.avatar}
                alt={creator.displayName}
                className="w-full h-full object-cover bg-black-surface"
              />
            </div>
            {creator.isOnline && (
              <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500 ring-4 ring-black-deep" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-1">
                  {creator.displayName}
                  {creator.verified && <CheckCircle className="w-6 h-6 text-purple-neon" />}
                </h1>
                <p className="text-gray-400 text-lg mb-3">@{creator.username}</p>
                <p className="text-gray-300 max-w-2xl text-sm leading-relaxed mb-4">
                  {creator.bio}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <strong className="text-white">{(creator.followers / 1000).toFixed(0)}K</strong> Followers
                  </span>
                  <span><strong className="text-white">{creator.posts}</strong> Posts</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                    isFollowing
                      ? 'border border-white/20 text-white hover:bg-white/5'
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
          <nav className="flex gap-8 min-w-max">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href || (pathname === `/creator/${username}` && tab.label === 'Home');
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`relative py-4 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab.locked && <Lock className="w-3.5 h-3.5" />}
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="creator-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-neon"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
