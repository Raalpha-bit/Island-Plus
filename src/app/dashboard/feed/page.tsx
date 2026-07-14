'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Loader2, Lock, Crown } from 'lucide-react';
import Link from 'next/link';
import { Api } from '@/lib/api';

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      const data = await Api.get<any[]>('/posts?feed=true');
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load feed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      // Toggle like in database (optimistic UI update could be done, but simple is robust)
      await Api.post(`/posts/${postId}/like`, {});
      // Reload or locally toggle
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, likesCount: p.likesCount + (p.isLikedByMe ? -1 : 1), isLikedByMe: !p.isLikedByMe }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle like');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
      </div>
    );
  }

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

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-gray-400 mb-4">Your feed is empty. Explore and subscribe to creators to see their content!</p>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl gradient-purple text-white font-bold hover:opacity-90 transition-all glow-purple"
          >
            Explore Creators
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="glass-card rounded-2xl overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href={`/creator/${post.creator.username}`}>
                    <img
                      src={post.creator.avatar}
                      alt={post.creator.displayName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-royal/30 hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div>
                    <Link href={`/creator/${post.creator.username}`} className="hover:underline">
                      <h3 className="text-sm font-bold text-white flex items-center gap-1">
                        {post.creator.displayName}
                        {post.creator.verified && (
                          <span className="w-3.5 h-3.5 rounded-full bg-purple-neon flex items-center justify-center text-[8px] text-white">✓</span>
                        )}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>@{post.creator.username}</span>
                      <span>•</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-200">{post.body}</p>
              </div>

              {/* Post Media or Lock Screen */}
              {post.isLocked ? (
                <div className="relative aspect-video bg-black-surface flex flex-col items-center justify-center text-center p-6 border-y border-white/5">
                  <div className="absolute inset-0 opacity-20 filter blur-xl bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500')] bg-cover" />
                  <div className="relative z-10 max-w-sm">
                    <div className="w-12 h-12 rounded-full bg-purple-royal/20 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-5 h-5 text-purple-neon" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">Locked Content</h4>
                    <p className="text-xs text-gray-400 mb-6">This post is exclusive to {post.requiredTier.toUpperCase()} tier subscribers and above.</p>
                    <Link
                      href={`/creator/${post.creator.username}/about`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-purple text-xs font-bold text-white hover:opacity-90 transition-all glow-purple"
                    >
                      <Crown className="w-3.5 h-3.5" /> Unlock this Post
                    </Link>
                  </div>
                </div>
              ) : (
                post.media && post.media.length > 0 && (
                  <div className="relative w-full aspect-[4/5] sm:aspect-video bg-black-surface border-y border-white/5">
                    <img
                      src={post.media[0].url}
                      alt="Post content"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}

              {/* Post Actions */}
              <div className="p-4 flex items-center justify-between border-t border-white/5 mt-2">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors group ${
                      post.isLikedByMe ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLikedByMe ? 'fill-pink-500' : 'group-hover:fill-pink-500'}`} />
                    <span className="text-sm font-medium">{post.likesCount}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-neon transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.commentsCount}</span>
                  </button>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
