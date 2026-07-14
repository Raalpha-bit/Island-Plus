import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const supabase = await createClient();

    // Query creator profile joined with user profile
    const { data: creator, error } = await supabase
      .from('creators')
      .select(`
        id,
        category,
        cover_url,
        total_followers,
        total_subscribers,
        total_posts,
        total_likes,
        is_live,
        is_online,
        social_links,
        price_bronze,
        price_silver,
        price_gold,
        price_black,
        features_bronze,
        features_silver,
        features_gold,
        features_black,
        profiles!inner (
          id,
          username,
          display_name,
          avatar_url,
          bio,
          is_verified,
          country
        )
      `)
      .eq('profiles.username', username)
      .single();

    if (error || !creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    // Check if the current authenticated user has a subscription to this creator
    const { data: { user } } = await supabase.auth.getUser();
    let isSubscribed = false;
    let subscriptionTier = null;

    if (user) {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('tier, status')
        .eq('subscriber_id', user.id)
        .eq('creator_id', creator.id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (sub) {
        isSubscribed = true;
        subscriptionTier = sub.tier;
      }
    }

    // Format to match old schema + details
    const formatted = {
      id: creator.id,
      username: creator.profiles.username,
      displayName: creator.profiles.display_name,
      avatar: creator.profiles.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
      cover: creator.cover_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
      bio: creator.profiles.bio || '',
      verified: creator.profiles.is_verified || false,
      category: creator.category,
      country: creator.profiles.country || '',
      followers: creator.total_followers,
      subscribers: creator.total_subscribers,
      posts: creator.total_posts,
      likes: creator.total_likes,
      isLive: creator.is_live,
      isOnline: creator.is_online,
      subscriptionPrice: creator.price_bronze || 4.99,
      isSubscribed,
      subscriptionTier,
      creatorProfile: {
        displayName: creator.profiles.display_name,
        avatar: creator.profiles.avatar_url,
        coverImage: creator.cover_url,
        bio: creator.profiles.bio,
        isLive: creator.is_live,
        _count: {
          subscribers: creator.total_subscribers,
          posts: creator.total_posts,
        }
      },
      tiers: [
        { id: 'bronze', name: 'Bronze', price: Number(creator.price_bronze) || 4.99, color: '#CD7F32', features: creator.features_bronze || [] },
        { id: 'silver', name: 'Silver', price: Number(creator.price_silver) || 9.99, color: '#C0C0C0', features: creator.features_silver || [] },
        { id: 'gold', name: 'Gold', price: Number(creator.price_gold) || 19.99, color: '#FFD700', features: creator.features_gold || [] },
        { id: 'black', name: 'Black', price: Number(creator.price_black) || 49.99, color: '#1a1a1a', features: creator.features_black || [] }
      ],
      socialLinks: creator.social_links || []
    };

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
