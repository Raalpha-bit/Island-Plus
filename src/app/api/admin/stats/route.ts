import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileErr || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Compute stats
    const { data: usersCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    const { data: creatorsCount } = await supabase
      .from('creators')
      .select('id', { count: 'exact', head: true });

    // Fetch sum of platform fees
    const { data: transactions } = await supabase
      .from('transactions')
      .select('platform_fee, created_at')
      .eq('status', 'completed');

    const totalFees = (transactions || []).reduce((sum, tx) => sum + Number(tx.platform_fee), 0);

    // Fetch pending withdrawals count
    const { data: withdrawals } = await supabase
      .from('withdrawal_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Build 7-day revenue chart
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartMap = new Map();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const name = days[d.getDay()];
      chartMap.set(name, { name, revenue: 0 });
    }

    if (transactions) {
      for (const tx of transactions) {
        const txDate = new Date(tx.created_at);
        if (Date.now() - txDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
          const name = days[txDate.getDay()];
          if (chartMap.has(name)) {
            const current = chartMap.get(name);
            current.revenue += Number(tx.platform_fee);
            chartMap.set(name, current);
          }
        }
      }
    }

    const chartData = Array.from(chartMap.values()).reverse();

    return NextResponse.json({
      totalPlatformRevenue: totalFees,
      totalUsers: usersCount || 0,
      totalCreators: creatorsCount || 0,
      openWithdrawals: withdrawals || 0,
      chartData
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
