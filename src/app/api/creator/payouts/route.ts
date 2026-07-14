import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: withdrawals, error } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(withdrawals);
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

    const body = await request.json();
    const { amount } = body;

    const requestAmount = Number(amount);
    if (!requestAmount || requestAmount <= 0) {
      return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 });
    }

    // Check user's current profile wallet balance
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const balance = Number(profile.wallet_balance);
    if (balance < requestAmount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // Deduct amount from wallet balance
    const { error: deductErr } = await supabase
      .from('profiles')
      .update({ wallet_balance: balance - requestAmount })
      .eq('id', user.id);

    if (deductErr) {
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }

    // Insert withdrawal request
    const { data: withdrawal, error: insertErr } = await supabase
      .from('withdrawal_requests')
      .insert({
        creator_id: user.id,
        amount: requestAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (insertErr) {
      // Rollback balance update
      await supabase
        .from('profiles')
        .update({ wallet_balance: balance })
        .eq('id', user.id);

      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json(withdrawal);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
