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

    // Derive base URL from the request origin (works with any domain)
    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.bizplangenius.com';
    const baseUrl = origin.replace(/\/$/, ''); // Remove trailing slash

    // Validate required fields
    const { businessName, industry, description, targetMarket, revenueModel } = body;
    if (!businessName || !industry || !description || !targetMarket || !revenueModel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine tier and price
    const tier = body.tier === 'starter' ? 'starter' : 'pro';
    const isStarter = tier === 'starter';
    const unitAmount = isStarter ? 2900 : 4900; // $29 or $49
    const planLabel = isStarter ? 'Starter Business Plan' : 'Pro Business Plan';

    // Create a Stripe Checkout session
    const stripe = getStripe();
    const customerEmail = body.email || undefined;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planLabel} - ${businessName}`,
              description: isStarter
                ? 'Business plan with real competitor research, market analysis, and financial projections.'
                : 'Complete business plan with competitor research, market analysis, financial projections, operations plan, risk analysis, and money-back guarantee.',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/generate`,
      metadata: {
        tier,
        businessName,
        industry,
        description: description.substring(0, 500), // Stripe metadata limit
        targetMarket: targetMarket.substring(0, 500),
        revenueModel,
        location: body.location || '',
        investment: body.investment || '',
        competitors: (body.competitors || '').substring(0, 500),
        email: body.email || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
