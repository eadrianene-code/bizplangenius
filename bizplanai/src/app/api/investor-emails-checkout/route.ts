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
              name: 'Investor Email Templates',
              description: '10 personalized investor outreach emails with subject lines, follow-ups, and warm intro templates. Built from your business plan.',
            },
            unit_amount: 1900, // $19
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/investor-emails?session_id={CHECKOUT_SESSION_ID}&plan_session_id=${planSessionId}`,
      cancel_url: `${baseUrl}/investor-emails?plan_session_id=${planSessionId}`,
      metadata: {
        product: 'investor_emails',
        planSessionId,
        email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Investor emails checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
