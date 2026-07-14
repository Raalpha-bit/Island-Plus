'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Loader2 } from 'lucide-react';
import { Api } from '@/lib/api';

export default function SubscriptionPlans({ creator }: { creator: any }) {
  const [subscribingTier, setSubscribingTier] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string) => {
    try {
      setSubscribingTier(tierId);
      const res = await Api.post<{ sessionId: string; url: string }>('/subscriptions', {
        creatorId: creator.id,
        tier: tierId,
      });

      if (res.url) {
        window.location.href = res.url;
      } else {
        alert('Stripe URL not found. Subscription checkout could not start.');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred. Make sure you are logged in.');
    } finally {
      setSubscribingTier(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {creator.tiers.map((tier: any, index: number) => {
        const isSubscribing = subscribingTier === tier.id;
        return (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative rounded-2xl overflow-hidden ${
              tier.id === 'black' ? 'bg-black-surface border-2 border-purple-royal/50' : 'glass-card'
            }`}
          >
            {tier.id === 'black' && (
              <div className="absolute top-0 inset-x-0 h-1 gradient-purple" />
            )}
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tier.color }}
                />
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                {tier.id === 'black' && (
                  <Star className="w-4 h-4 text-purple-neon ml-auto fill-purple-neon" />
                )}
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">${tier.price}</span>
                <span className="text-gray-400">/mo</span>
              </div>

              <button
                onClick={() => handleSubscribe(tier.id)}
                disabled={subscribingTier !== null}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 mb-6 flex items-center justify-center gap-2 cursor-pointer ${
                  tier.id === 'black'
                    ? 'gradient-purple text-white hover:opacity-90 glow-purple disabled:opacity-50'
                    : 'bg-white/5 text-white hover:bg-white/10 disabled:opacity-50'
                }`}
              >
                {isSubscribing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Subscribe'
                )}
              </button>

              <ul className="space-y-3">
                {tier.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
