'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { creators } from '@/lib/mock/creators';
import LockedContent from '@/components/creator/LockedContent';

export default function CreatorLivePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const creator = creators.find((c) => c.username === username) || creators[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <LockedContent creator={creator} type="live" />
    </motion.div>
  );
}
