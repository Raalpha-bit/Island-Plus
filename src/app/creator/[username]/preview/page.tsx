'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { creators } from '@/lib/mock/creators';
import ContentGrid from '@/components/content/ContentGrid';
import { Sparkles } from 'lucide-react';

export default function CreatorPreviewPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const creator = creators.find((c) => c.username === username) || creators[0];

  const previewItems = creator.previewImages.map((url, i) => ({
    id: `preview-${i}`,
    type: 'image' as const,
    url,
    locked: false,
    likes: 1500 + i * 200,
    comments: 80 + i * 15,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Free Preview <Sparkles className="w-5 h-5 text-purple-neon" />
          </h2>
          <p className="text-sm text-gray-400">Sneak peek at {creator.displayName}'s exclusive content.</p>
        </div>
      </div>

      <ContentGrid items={previewItems} isSubscribed={true} />
    </motion.div>
  );
}
