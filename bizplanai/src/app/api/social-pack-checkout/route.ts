import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { buildCheckoutMetadata } from '@/lib/product-utils';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Must have either planSessionId or direct business details
    if (!body.planSessionId && !body.businessName) {
      return NextResponse.json({ error: 'Business details or plan session required' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || 'https://www.bizplangenius.com';
    const baseUrl = origin.replace(/\/$/, '');

    const planParam = body.planSessionId ? `&plan_session_id=${body.planSessionId}` : '';

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Social Media Starter Pack - 30 Days',
              description: '30 days of ready-to-post social media content for Twitter, LinkedIn, Instagram, and Facebook.',
            },
            unit_amount: 2900,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/social-pack?session_id={CHECKOUT_SESSION_ID}${planParam}`,
      cancel_url: `${baseUrl}/social-pack`,
      metadata: {
        product: 'social_media_pack',
        ...buildCheckoutMetadata(body),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Social pack checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
