import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const isFeed = searchParams.get('feed') === 'true';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Query posts
    let query = supabase
      .from('posts')
      .select(`
        id,
        creator_id,
        title,
        body,
        media,
        required_tier,
        is_free_preview,
        likes_count,
        comments_count,
        views_count,
        is_pinned,
        published_at,
        created_at,
        creators (
          id,
          category,
          price_bronze,
          profiles (
            username,
            display_name,
            avatar_url,
            is_verified
          )
        )
      `)
      .order('published_at', { ascending: false });

    if (creatorId) {
      query = query.eq('creator_id', creatorId);
    }

    const { data: posts, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If logged in, fetch user's active subscriptions to evaluate lock status
    let activeSubs: any[] = [];
    if (user) {
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('creator_id, tier')
        .eq('subscriber_id', user.id)
        .eq('status', 'active');
      if (subs) activeSubs = subs;
    }

    // Map tier weights for comparison
    const tierWeight = { bronze: 1, silver: 2, gold: 3, black: 4 };

    // Format posts and determine if they are locked for the current user
    const formattedPosts = posts.map((post: any) => {
      const creator = post.creators;
      const isOwner = user?.id === post.creator_id;
      
      let isLocked = false;
      if (post.required_tier && !isOwner) {
        const userSub = activeSubs.find(s => s.creator_id === post.creator_id);
        if (!userSub) {
          isLocked = true;
        } else {
          const reqWeight = tierWeight[post.required_tier as keyof typeof tierWeight] || 0;
          const userWeight = tierWeight[userSub.tier as keyof typeof tierWeight] || 0;
          if (userWeight < reqWeight) {
            isLocked = true;
          }
        }
      }

      // If locked and not a free preview, redact private media URLs
      let mediaItems = post.media || [];
      if (isLocked && !post.is_free_preview) {
        mediaItems = mediaItems.map((m: any) => ({
          ...m,
          url: '', // Redacted
          thumbnail: m.thumbnail || '',
          locked: true
        }));
      }

      return {
        id: post.id,
        title: post.title,
        body: isLocked && !post.is_free_preview ? '🔒 This content is locked. Subscribe to view.' : post.body,
        media: mediaItems,
        requiredTier: post.required_tier,
        isFreePreview: post.is_free_preview,
        likesCount: post.likes_count,
        commentsCount: post.comments_count,
        viewsCount: post.views_count,
        isPinned: post.is_pinned,
        publishedAt: post.published_at,
        isLocked,
        creator: {
          id: creator?.id,
          username: creator?.profiles?.username,
          displayName: creator?.profiles?.display_name,
          avatar: creator?.profiles?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
          verified: creator?.profiles?.is_verified || false
        }
      };
    });

    return NextResponse.json(formattedPosts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a creator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'creator') {
      return NextResponse.json({ error: 'Only creators can publish posts' }, { status: 403 });
    }

    const body = await request.json();
    const { title, text, media, requiredTier, isFreePreview } = body;

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        creator_id: user.id,
        title: title || null,
        body: text || '',
        media: media || [],
        required_tier: requiredTier || null,
        is_free_preview: !!isFreePreview,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(post);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
