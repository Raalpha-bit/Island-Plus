'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle, Lock, Image as ImageIcon, Video } from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  locked: boolean;
  likes: number;
  comments: number;
}

export default function ContentGrid({ items, isSubscribed = false }: { items: ContentItem[], isSubscribed?: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer bg-black-surface"
        >
          {/* Image/Thumbnail */}
          <img
            src={item.type === 'video' ? item.thumbnail || item.url : item.url}
            alt="Content"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              item.locked && !isSubscribed ? 'content-locked-light' : ''
            }`}
          />

          {/* Locked Overlay */}
          {item.locked && !isSubscribed && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
            </div>
          )}

          {/* Type Icon */}
          <div className="absolute top-2 right-2 flex gap-1">
            {item.type === 'video' && (
              <div className="w-6 h-6 rounded-md bg-black/60 backdrop-blur-md flex items-center justify-center">
                <Video className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            {item.type === 'image' && (
              <div className="w-6 h-6 rounded-md bg-black/60 backdrop-blur-md flex items-center justify-center">
                <ImageIcon className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          {/* Hover Stats Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
            <div className="flex items-center gap-1.5 text-white font-medium">
              <Heart className="w-5 h-5 fill-white" />
              {item.likes}
            </div>
            <div className="flex items-center gap-1.5 text-white font-medium">
              <MessageCircle className="w-5 h-5 fill-white" />
              {item.comments}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
