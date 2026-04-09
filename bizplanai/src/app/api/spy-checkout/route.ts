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

    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.bizplangenius.com';
    const baseUrl = origin.replace(/\/$/, '');

    const { mode, email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (mode === 'company') {
      if (!body.companyName) {
        return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
      }
    } else {
      if (!body.industryDescription || !body.industry) {
        return NextResponse.json({ error: 'Industry description and category are required' }, { status: 400 });
      }
    }

    const productName = mode === 'company'
      ? `Competitor Spy Report: ${body.companyName}`
      : `Competitor Spy Report: ${body.industry}`;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: 'Competitive analysis report with real competitor data, pricing comparison, SWOT analysis, and strategic recommendations.',
            },
            unit_amount: 1900, // $19.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/spy/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/spy`,
      allow_promotion_codes: true,
      metadata: {
        product: 'competitor_spy',
        mode,
        companyName: body.companyName || '',
        companyUrl: body.companyUrl || '',
        industryDescription: (body.industryDescription || '').substring(0, 500),
        industry: body.industry || '',
        city: body.city || '',
        country: body.country || '',
        email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Spy checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
