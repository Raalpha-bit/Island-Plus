import { Lock, Crown } from 'lucide-react';
import Link from 'next/link';
import { Creator } from '@/lib/mock/creators';

interface LockedContentProps {
  creator: Creator;
  type?: 'post' | 'gallery' | 'video' | 'live' | 'community';
}

export default function LockedContent({ creator, type = 'post' }: LockedContentProps) {
  const getMessage = () => {
    switch (type) {
      case 'gallery': return "Subscribe to unlock this creator's full galleries.";
      case 'video': return "Subscribe to unlock this creator's exclusive videos.";
      case 'live': return "Subscribe to join this creator's private live streams.";
      case 'community': return "Subscribe to unlock this creator's private community.";
      default: return "Subscribe to unlock this creator's exclusive content.";
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden glass-card min-h-[400px] flex items-center justify-center p-8 text-center group">
      {/* Background Blur Elements */}
      <div className="absolute inset-0 bg-black-surface/50 backdrop-blur-xl z-0" />
      <div className="absolute inset-0 content-locked bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 z-0" />
      
      <div className="relative z-10 max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto rounded-full bg-purple-royal/20 flex items-center justify-center mb-6 ring-4 ring-purple-royal/10 group-hover:scale-110 transition-transform duration-500">
          <Lock className="w-8 h-8 text-purple-neon" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">LOCKED CONTENT</h3>
        <p className="text-gray-300 mb-8">{getMessage()}</p>
        
        <div className="space-y-4">
          <Link
            href={`/creator/${creator.username}/about`}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl gradient-purple text-white font-bold hover:opacity-90 transition-all glow-purple"
          >
            <Crown className="w-5 h-5" />
            Subscribe from ${creator.subscriptionPrice}/mo
          </Link>
          <p className="text-xs text-gray-500">
            Cancel anytime. Secure payment processing.
          </p>
        </div>
      </div>
    </div>
  );
}
