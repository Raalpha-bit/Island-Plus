'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Api } from '@/lib/api';
import ContentGrid from '@/components/content/ContentGrid';
import LockedContent from '@/components/creator/LockedContent';

export default function CreatorHomePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [creator, setCreator] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCreatorAndPosts() {
      try {
        setIsLoading(true);
        // 1. Get creator profile
        const creatorData = await Api.get<any>(`/creators/${username}`);
        setCreator(creatorData);

        // 2. Fetch posts of creator
        const postsData = await Api.get<any[]>(`/posts?creatorId=${creatorData.id}`);
        setPosts(postsData);
      } catch (err) {
        console.error('Failed to load creator feed', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCreatorAndPosts();
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="text-center py-20 text-gray-400">
        Creator not found.
      </div>
    );
  }

  // Format posts to fit ContentGrid item structure
  const gridItems = posts.map((post) => {
    const hasMedia = post.media && post.media.length > 0;
    const mediaItem = hasMedia ? post.media[0] : null;

    return {
      id: post.id,
      type: (mediaItem?.type || 'image') as 'image' | 'video',
      url: mediaItem?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500', // fallback placeholder
      thumbnail: mediaItem?.thumbnail || mediaItem?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
      locked: post.isLocked,
      likes: post.likesCount || 0,
      comments: post.commentsCount || 0,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl"
    >
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Latest Content</h2>
        {gridItems.length === 0 ? (
          <p className="text-gray-400 text-sm">No content published yet.</p>
        ) : (
          <ContentGrid items={gridItems} isSubscribed={creator.isSubscribed} />
        )}
      </div>

      {!creator.isSubscribed && (
        <div className="mt-12">
          <LockedContent creator={creator} />
        </div>
      )}
    </motion.div>
  );
}
