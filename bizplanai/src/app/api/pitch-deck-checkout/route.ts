import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { planSessionId, email } = await req.json();

    if (!planSessionId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || 'https://www.bizplangenius.com';
    const baseUrl = origin.replace(/\/$/, '');

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI Pitch Deck Generator',
              description: 'Investor-ready pitch deck with 10-12 slides generated from your business plan. Includes problem, solution, market, traction, team, and financials.',
            },
            unit_amount: 3900, // $39
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/pitch-deck?session_id={CHECKOUT_SESSION_ID}&plan_session_id=${planSessionId}`,
      cancel_url: `${baseUrl}/pitch-deck?plan_session_id=${planSessionId}`,
      metadata: {
        product: 'pitch_deck',
        planSessionId,
        email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Pitch deck checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
