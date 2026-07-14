'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Api } from '@/lib/api';
import SubscriptionPlans from '@/components/creator/SubscriptionPlans';

export default function CreatorAboutPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [creator, setCreator] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCreator() {
      try {
        setIsLoading(true);
        const data = await Api.get<any>(`/creators/${username}`);
        setCreator(data);
      } catch (err) {
        console.error('Failed to load creator info', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCreator();
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
          <p>{creator.bio || 'No bio provided yet.'}</p>
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
