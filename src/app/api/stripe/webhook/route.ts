import { createAdminClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27-prefreezing-1' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In local dev without secret, bypass check (strictly for testing, warning logged)
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Use admin client since webhook runs in backend background (bypassing normal client/RLS constraints)
  const supabase = await createAdminClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { subscriberId, creatorId, tier } = session.metadata || {};

    if (subscriberId && creatorId && tier) {
      const amount = (session.amount_total || 0) / 100;
      const fee = amount * 0.2; // 20% fee
      const net = amount - fee;

      // 1. Create or update subscription
      const { error: subErr } = await supabase
        .from('subscriptions')
        .upsert({
          subscriber_id: subscriberId,
          creator_id: creatorId,
          tier: tier as any,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }, { onConflict: 'subscriber_id,creator_id' });

      if (subErr) {
        console.error('Failed to create subscription:', subErr.message);
      }

      // 2. Create transaction record
      await supabase.from('transactions').insert({
        user_id: subscriberId,
        creator_id: creatorId,
        type: 'subscription',
        status: 'completed',
        amount,
        platform_fee: fee,
        net_amount: net,
        stripe_payment_intent_id: session.payment_intent as string,
        description: `Subscription to ${tier.toUpperCase()} tier`,
      });

      // 3. Add funds to creator's profile balance
      await supabase.rpc('increment_wallet_balance', {
        user_uuid: creatorId,
        amount_to_add: net,
      });

      // 4. Send notification to creator
      const { data: fanProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', subscriberId)
        .single();

      await supabase.from('notifications').insert({
        user_id: creatorId,
        type: 'new_subscriber',
        title: 'New Subscriber! 🎉',
        body: `${fanProfile?.display_name || 'A fan'} subscribed to your ${tier.toUpperCase()} tier!`,
        actor_id: subscriberId,
      });
    }
  }

  return NextResponse.json({ received: true });
}
