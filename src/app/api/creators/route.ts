import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = supabase
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
        profiles (
          id,
          username,
          display_name,
          avatar_url,
          bio,
          is_verified,
          country
        )
      `)
      .eq('verification_status', 'approved');

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      // Use full text search or simple ilike via profile display_name / username
      // Since supabase-js doesn't allow joining filters directly easily, we can query profiles first or do it via custom logic if simple.
      // But standard way: profiles!inner(username) works for filter!
      query = query.or(`profiles.username.ilike.%${search}%,profiles.display_name.ilike.%${search}%`);
    }

    const { data: creators, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format to match old Creator mock format for frontend compatibility
    const formattedCreators = creators.map((c: any) => ({
      id: c.id,
      username: c.profiles?.username,
      displayName: c.profiles?.display_name,
      avatar: c.profiles?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
      cover: c.cover_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
      bio: c.profiles?.bio || '',
      verified: c.profiles?.is_verified || false,
      category: c.category,
      country: c.profiles?.country || '',
      followers: c.total_followers,
      subscribers: c.total_subscribers,
      posts: c.total_posts,
      likes: c.total_likes,
      isLive: c.is_live,
      isOnline: c.is_online,
      subscriptionPrice: c.price_bronze || 4.99,
      tiers: [
        { id: 'bronze', name: 'Bronze', price: Number(c.price_bronze) || 4.99, color: '#CD7F32', features: c.features_bronze || [] },
        { id: 'silver', name: 'Silver', price: Number(c.price_silver) || 9.99, color: '#C0C0C0', features: c.features_silver || [] },
        { id: 'gold', name: 'Gold', price: Number(c.price_gold) || 19.99, color: '#FFD700', features: c.features_gold || [] },
        { id: 'black', name: 'Black', price: Number(c.price_black) || 49.99, color: '#1a1a1a', features: c.features_black || [] }
      ],
      socialLinks: c.social_links || []
    }));

    return NextResponse.json(formattedCreators);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
