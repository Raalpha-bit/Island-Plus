'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { creators } from '@/lib/mock/creators';
import SubscriptionPlans from '@/components/creator/SubscriptionPlans';

export default function CreatorAboutPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const creator = creators.find((c) => c.username === username) || creators[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* About Section */}
      <section className="glass-card rounded-2xl p-8 max-w-4xl">
        <h2 className="text-2xl font-bold text-white mb-4">About {creator.displayName}</h2>
        <div className="prose prose-invert max-w-none text-gray-300">
          <p>{creator.bio}</p>
          <p className="mt-4">
            Welcome to my exclusive Island+ community! By subscribing, you get access to my private life, unseen content, behind-the-scenes footage, and 1-on-1 interaction.
          </p>
        </div>
      </section>

      {/* Subscription Plans */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Subscription Plans</h2>
          <p className="text-gray-400">Choose a tier to unlock exclusive content and perks.</p>
        </div>
        <SubscriptionPlans creator={creator} />
      </section>
    </motion.div>
  );
}
