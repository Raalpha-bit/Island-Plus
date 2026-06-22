'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { creators } from '@/lib/mock/creators';
import ContentGrid from '@/components/content/ContentGrid';
import LockedContent from '@/components/creator/LockedContent';

export default function CreatorHomePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const creator = creators.find((c) => c.username === username) || creators[0];

  // Mock content items for home tab
  const homeItems = [
    { id: '1', type: 'image' as const, url: creator.previewImages[0], locked: false, likes: 1200, comments: 45 },
    { id: '2', type: 'image' as const, url: creator.previewImages[1], locked: false, likes: 850, comments: 32 },
    { id: '3', type: 'video' as const, url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop', locked: true, likes: 2300, comments: 120 },
    { id: '4', type: 'image' as const, url: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=500&h=500&fit=crop', locked: true, likes: 1500, comments: 88 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl"
    >
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Latest Content</h2>
        <ContentGrid items={homeItems} isSubscribed={false} />
      </div>

      <div className="mt-12">
        <LockedContent creator={creator} />
      </div>
    </motion.div>
  );
}
