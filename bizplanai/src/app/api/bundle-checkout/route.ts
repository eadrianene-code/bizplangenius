import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

const BUNDLES: Record<string, { name: string; price: number; products: string[] }> = {
  starter: {
    name: 'Starter Bundle',
    price: 19700, // $197 (save $47 vs $97+$147)
    products: ['spy_report', 'business_plan_pro'],
  },
  launch: {
    name: 'Launch Pack',
    price: 29700, // $297 (save $85 vs $97+$147+$99+$39)
    products: ['spy_report', 'business_plan_pro', 'website_landing', 'pitch_deck'],
  },
  full: {
    name: 'Full Business Kit',
    price: 44700, // $447 (save $50 vs buying all separately)
    products: ['spy_report', 'business_plan_pro', 'website_landing', 'pitch_deck', 'social_media_pack', 'brand_kit'],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bundle, email, businessName, industry, description, targetMarket, revenueModel, location, investment, competitors } = body;

    if (!bundle || !email || !BUNDLES[bundle]) {
      return NextResponse.json({ error: 'Invalid bundle or missing email' }, { status: 400 });
    }

    const bundleConfig = BUNDLES[bundle];
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
              name: bundleConfig.name,
              description: `Includes: ${bundleConfig.products.length} products. All generated from your business details.`,
            },
            unit_amount: bundleConfig.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/bundles`,
      metadata: {
        product: 'bundle',
        bundle,
        tier: 'pro',
        businessName: (businessName || '').substring(0, 500),
        industry: industry || '',
        description: (description || '').substring(0, 500),
        targetMarket: (targetMarket || '').substring(0, 500),
        revenueModel: revenueModel || '',
        location: location || '',
        investment: investment || '',
        competitors: (competitors || '').substring(0, 500),
        email,
        bundleProducts: bundleConfig.products.join(','),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Bundle checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
