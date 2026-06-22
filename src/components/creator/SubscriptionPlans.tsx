'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Creator } from '@/lib/mock/creators';

export default function SubscriptionPlans({ creator }: { creator: Creator }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {creator.tiers.map((tier, index) => (
        <motion.div
          key={tier.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`relative rounded-2xl overflow-hidden ${
            tier.name === 'Black' ? 'bg-black-surface border-2 border-purple-royal/50' : 'glass-card'
          }`}
        >
          {tier.name === 'Black' && (
            <div className="absolute top-0 inset-x-0 h-1 gradient-purple" />
          )}
          
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
              {tier.name === 'Black' && (
                <Star className="w-4 h-4 text-purple-neon ml-auto fill-purple-neon" />
              )}
            </div>

            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">${tier.price}</span>
              <span className="text-gray-400">/mo</span>
            </div>

            <button
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 mb-6 ${
                tier.name === 'Black'
                  ? 'gradient-purple text-white hover:opacity-90 glow-purple'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              Subscribe
            </button>

            <ul className="space-y-3">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
