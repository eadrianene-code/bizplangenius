import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planSessionId, websiteType, colorScheme, email, extraInstructions } = body;

    if (!planSessionId || !websiteType || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || 'https://www.bizplangenius.com';
    const baseUrl = origin.replace(/\/$/, '');

    // Determine price based on website type
    const prices: Record<string, number> = {
      landing: 9900,      // $99
      portfolio: 9900,    // $99
      booking: 12900,     // $129
      restaurant: 12900,  // $129
      ecommerce: 14900,   // $149
      saas: 19900,        // $199
    };
    const unitAmount = prices[websiteType] || 9900;
    const priceLabel = `$${unitAmount / 100}`;

    const typeLabels: Record<string, string> = {
      landing: 'Landing Page',
      portfolio: 'Portfolio Website',
      booking: 'Booking Website',
      restaurant: 'Restaurant Website',
      ecommerce: 'E-commerce Website',
      saas: 'SaaS Website',
    };
    const typeLabel = typeLabels[websiteType] || 'Website';

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AI Website Builder - ${typeLabel}`,
              description: `Custom ${typeLabel.toLowerCase()} generated from your business plan. Includes full HTML/CSS source code and live preview.`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/build-website?session_id={CHECKOUT_SESSION_ID}&plan_session_id=${planSessionId}&type=${websiteType}&color=${colorScheme || 'blue'}`,
      cancel_url: `${baseUrl}/build-website?plan_session_id=${planSessionId}`,
      metadata: {
        product: 'website_builder',
        websiteType,
        colorScheme: colorScheme || 'blue',
        planSessionId,
        email,
        extraInstructions: (extraInstructions || '').substring(0, 500),
        paymentType: body.paymentType || '',
        paymentLink: body.paymentLink || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Website checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
