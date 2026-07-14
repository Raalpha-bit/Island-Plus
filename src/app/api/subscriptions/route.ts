import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27-prefreezing-1' as any, // fallback/suppress error or omit
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { creatorId, tier } = body;

    if (!creatorId || !tier) {
      return NextResponse.json({ error: 'Missing creatorId or tier' }, { status: 400 });
    }

    // Fetch creator and their tier price
    const { data: creator, error: creatorErr } = await supabase
      .from('creators')
      .select(`
        id,
        price_bronze,
        price_silver,
        price_gold,
        price_black,
        profiles (
          username,
          display_name
        )
      `)
      .eq('id', creatorId)
      .single();

    if (creatorErr || !creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    const priceMap = {
      bronze: creator.price_bronze,
      silver: creator.price_silver,
      gold: creator.price_gold,
      black: creator.price_black
    };

    const price = Number(priceMap[tier as keyof typeof priceMap]);
    if (!price || price <= 0) {
      return NextResponse.json({ error: 'Invalid subscription tier price' }, { status: 400 });
    }

    // Get or create Stripe Customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, display_name')
      .eq('id', user.id)
      .single();

    let stripeCustomerId = profile?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.display_name || undefined,
        metadata: {
          userId: user.id
        }
      });
      stripeCustomerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id);
    }

    const { origin } = new URL(request.url);

    // Create Stripe Checkout Session with dynamic inline price
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Island+ subscription to ${creator.profiles.display_name}`,
              description: `Tier: ${tier.toUpperCase()}`,
            },
            unit_amount: Math.round(price * 100),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/creator/${creator.profiles.username}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/creator/${creator.profiles.username}`,
      metadata: {
        subscriberId: user.id,
        creatorId: creator.id,
        tier: tier,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
