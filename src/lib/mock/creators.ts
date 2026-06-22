export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  cover: string;
  bio: string;
  verified: boolean;
  category: string;
  country: string;
  followers: number;
  subscribers: number;
  posts: number;
  likes: number;
  isLive: boolean;
  isOnline: boolean;
  joinedDate: string;
  subscriptionPrice: number;
  tiers: SubscriptionTier[];
  socialLinks: { platform: string; url: string }[];
  previewImages: string[];
}

export interface SubscriptionTier {
  id: string;
  name: 'Bronze' | 'Silver' | 'Gold' | 'Black';
  price: number;
  color: string;
  features: string[];
}

const defaultTiers: SubscriptionTier[] = [
  { id: 'bronze', name: 'Bronze', price: 4.99, color: '#CD7F32', features: ['Exclusive posts', 'Community access'] },
  { id: 'silver', name: 'Silver', price: 9.99, color: '#C0C0C0', features: ['Exclusive posts', 'Stories', 'Community access', 'Direct messages'] },
  { id: 'gold', name: 'Gold', price: 19.99, color: '#FFD700', features: ['All Silver perks', 'Live streams', 'Behind the scenes', 'Priority replies'] },
  { id: 'black', name: 'Black', price: 49.99, color: '#1a1a1a', features: ['Everything included', 'VIP access', 'Priority interaction', '1-on-1 sessions', 'Custom content'] },
];

export const creators: Creator[] = [
  {
    id: '1', username: 'islandqueen', displayName: 'Jade Monroe',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
    bio: '🌴 Island lifestyle & fashion creator. Living my best Caribbean life. Exclusive behind-the-scenes content daily.',
    verified: true, category: 'Lifestyle', country: 'Jamaica', followers: 245000, subscribers: 12400,
    posts: 892, likes: 1800000, isLive: false, isOnline: true, joinedDate: '2024-03-15',
    subscriptionPrice: 9.99, tiers: defaultTiers, socialLinks: [{ platform: 'Instagram', url: '#' }],
    previewImages: [
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=400&fit=crop',
    ],
  },
  {
    id: '2', username: 'fitking_marcus', displayName: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop',
    bio: '💪 Elite fitness coach. Transform your body with my exclusive workout programs & meal plans.',
    verified: true, category: 'Fitness', country: 'United States', followers: 189000, subscribers: 8700,
    posts: 654, likes: 920000, isLive: true, isOnline: true, joinedDate: '2024-01-20',
    subscriptionPrice: 14.99, tiers: defaultTiers, socialLinks: [{ platform: 'YouTube', url: '#' }],
    previewImages: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop',
    ],
  },
  {
    id: '3', username: 'lens_sofia', displayName: 'Sofia Rivera',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=400&fit=crop',
    bio: '📸 Professional photographer. Fine art, fashion & portrait work. Exclusive unreleased galleries.',
    verified: true, category: 'Photography', country: 'Brazil', followers: 312000, subscribers: 15200,
    posts: 1243, likes: 2400000, isLive: false, isOnline: true, joinedDate: '2023-11-05',
    subscriptionPrice: 12.99, tiers: defaultTiers, socialLinks: [{ platform: 'Instagram', url: '#' }],
    previewImages: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop',
    ],
  },
  {
    id: '4', username: 'dj_nova', displayName: 'Nova Williams',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop',
    bio: '🎵 DJ & music producer. Exclusive tracks, behind-the-scenes studio sessions & live sets.',
    verified: true, category: 'Music', country: 'United Kingdom', followers: 156000, subscribers: 6800,
    posts: 423, likes: 780000, isLive: true, isOnline: true, joinedDate: '2024-06-10',
    subscriptionPrice: 7.99, tiers: defaultTiers, socialLinks: [{ platform: 'Spotify', url: '#' }],
    previewImages: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    ],
  },
  {
    id: '5', username: 'tropical_maya', displayName: 'Maya Laurent',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=400&fit=crop',
    bio: '✈️ Travel creator exploring paradise islands. Exclusive travel guides & hidden gem locations.',
    verified: true, category: 'Travel', country: 'France', followers: 278000, subscribers: 11300,
    posts: 756, likes: 1500000, isLive: false, isOnline: false, joinedDate: '2024-02-28',
    subscriptionPrice: 8.99, tiers: defaultTiers, socialLinks: [{ platform: 'TikTok', url: '#' }],
    previewImages: [
      'https://images.unsplash.com/photo-1502680390548-bdbac40a4e2a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=400&fit=crop',
    ],
  },
  {
    id: '6', username: 'style_aisha', displayName: 'Aisha Thompson',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop',
    bio: '👗 Fashion designer & stylist. Exclusive looks, styling tips & runway content.',
    verified: true, category: 'Fashion', country: 'Nigeria', followers: 198000, subscribers: 9400,
    posts: 567, likes: 1100000, isLive: false, isOnline: true, joinedDate: '2024-04-12',
    subscriptionPrice: 11.99, tiers: defaultTiers, socialLinks: [{ platform: 'Instagram', url: '#' }],
    previewImages: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
    ],
  },
  {
    id: '7', username: 'comedian_kai', displayName: 'Kai Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&h=400&fit=crop',
    bio: '😂 Comedian & entertainer. Exclusive skits, behind-the-scenes & unreleased content.',
    verified: false, category: 'Entertainment', country: 'Trinidad', followers: 87000, subscribers: 3200,
    posts: 234, likes: 450000, isLive: false, isOnline: false, joinedDate: '2024-08-01',
    subscriptionPrice: 5.99, tiers: defaultTiers, socialLinks: [{ platform: 'YouTube', url: '#' }],
    previewImages: [
      'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop',
    ],
  },
  {
    id: '8', username: 'island_vibes_zara', displayName: 'Zara Belle',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=1200&h=400&fit=crop',
    bio: '🌺 Model & content creator. Exclusive photoshoots, island vibes & premium content.',
    verified: true, category: 'Lifestyle', country: 'Barbados', followers: 425000, subscribers: 22100,
    posts: 1089, likes: 3200000, isLive: false, isOnline: true, joinedDate: '2023-09-20',
    subscriptionPrice: 14.99, tiers: defaultTiers, socialLinks: [{ platform: 'Instagram', url: '#' }],
    previewImages: [
      'https://images.unsplash.com/photo-1504730030853-eff311f57d3c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=400&h=400&fit=crop',
    ],
  },
];

export const categories = [
  { name: 'Lifestyle', icon: '🌴', count: 2840 },
  { name: 'Fitness', icon: '💪', count: 1920 },
  { name: 'Fashion', icon: '👗', count: 2150 },
  { name: 'Photography', icon: '📸', count: 1680 },
  { name: 'Music', icon: '🎵', count: 1340 },
  { name: 'Travel', icon: '✈️', count: 1560 },
  { name: 'Entertainment', icon: '🎬', count: 2070 },
  { name: 'Adult (18+)', icon: '🔞', count: 3200 },
];

export const testimonials = [
  { id: '1', name: 'Alex R.', role: 'Subscriber', text: "Island+ completely changed how I connect with my favorite creators. The community feels exclusive and genuine.", avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  { id: '2', name: 'Jade M.', role: 'Creator', text: "I've earned more in 3 months on Island+ than I did in a year on other platforms. The tools are incredible.", avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: '3', name: 'Marcus T.', role: 'Creator', text: "The community features are unmatched. My subscribers feel like a real family. Island+ is the future.", avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
  { id: '4', name: 'Sarah K.', role: 'Subscriber', text: "Finally a platform that feels premium. The content quality and creator interaction here is next level.", avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
];

export const platformStats = {
  creators: 15200,
  members: 2800000,
  content: 12500000,
  liveStreams: 3400,
};
