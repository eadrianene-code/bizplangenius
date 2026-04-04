import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

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

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Business Plan - ' + businessName,
              description: 'Complete business plan with real competitor research, market analysis, and financial projections.',
            },
            unit_amount: 4900, // $49.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/generate`,
      metadata: {
        businessName,
        industry,
        description: description.substring(0, 500), // Stripe metadata limit
        targetMarket: targetMarket.substring(0, 500),
        revenueModel,
        location: body.location || '',
        investment: body.investment || '',
        competitors: (body.competitors || '').substring(0, 500),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
