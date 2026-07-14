import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query transactions where user_id = user.id or creator_id = user.id (so creators see their earnings, fans see their spendings)
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        id,
        user_id,
        creator_id,
        type,
        status,
        amount,
        platform_fee,
        net_amount,
        currency,
        description,
        created_at,
        profiles!transactions_user_id_fkey(username, display_name),
        creators(profiles(username, display_name))
      `)
      .or(`user_id.eq.${user.id},creator_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(transactions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
