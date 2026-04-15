import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { buildCheckoutMetadata } from '@/lib/product-utils';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    if (!body.planSessionId && !body.businessName) return NextResponse.json({ error: 'Business details required' }, { status: 400 });

    const origin = req.headers.get('origin') || 'https://www.bizplangenius.com';
    const baseUrl = origin.replace(/\/$/, '');
    const planParam = body.planSessionId ? `&plan_session_id=${body.planSessionId}` : '';

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: body.email,
      line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Legal Pages Generator', description: 'Terms of Service + Privacy Policy tailored to your business. Ready to add to your website.' }, unit_amount: 1900 }, quantity: 1 }],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/legal-pages?session_id={CHECKOUT_SESSION_ID}${planParam}`,
      cancel_url: `${baseUrl}/legal-pages`,
      metadata: { product: 'legal_pages', ...buildCheckoutMetadata(body) },
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
