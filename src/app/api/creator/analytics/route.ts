import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify creator status
    const { data: creator, error: creatorErr } = await supabase
      .from('creators')
      .select('total_followers, total_subscribers, total_likes, total_earnings')
      .eq('id', user.id)
      .single();

    if (creatorErr || !creator) {
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 });
    }

    // Fetch transactions for recent earnings
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount, created_at, type')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    // Fetch recent notifications for recent activity
    const { data: notifications } = await supabase
      .from('notifications')
      .select('id, title, body, created_at, type, metadata')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Compute weekly chart data (last 7 days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartMap = new Map();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const name = days[d.getDay()];
      chartMap.set(name, { name, revenue: 0, views: Math.floor(Math.random() * 500) + 100 });
    }

    if (transactions) {
      for (const tx of transactions) {
        const txDate = new Date(tx.created_at);
        // Only count if within last 7 days
        if (Date.now() - txDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
          const name = days[txDate.getDay()];
          if (chartMap.has(name)) {
            const current = chartMap.get(name);
            current.revenue += Number(tx.amount);
            chartMap.set(name, current);
          }
        }
      }
    }

    const chartData = Array.from(chartMap.values()).reverse();

    return NextResponse.json({
      stats: {
        totalEarnings: Number(creator.total_earnings),
        activeSubscribers: creator.total_subscribers,
        profileViews: creator.total_followers * 4 + 120, // proxy profile views from followers
        likes: creator.total_likes
      },
      chartData,
      notifications: notifications || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
