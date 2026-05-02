import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendAbandonedCartEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

// Map session metadata.product to a customer-facing product name + URL
function deriveProduct(session: Stripe.Checkout.Session): {
  name: string;
  url: string;
  price: number;
} | null {
  const product = (session.metadata?.product as string) || '';
  const tier = (session.metadata?.tier as string) || '';

  if (product === 'competitor_spy' || product.includes('spy')) {
    return { name: 'Competitor Spy Report', url: 'https://www.bizplangenius.com/spy', price: 9700 };
  }
  if (product === 'bundle' || tier === 'pro') {
    // Business plan or bundle — point them to /generate as the safer, lower-friction restart
    const isStarter = tier === 'starter';
    return {
      name: isStarter ? 'Business Plan (Starter)' : 'Business Plan (Pro)',
      url: 'https://www.bizplangenius.com/generate',
      price: isStarter ? 9700 : 14700,
    };
  }
  if (tier === 'starter') {
    return { name: 'Business Plan (Starter)', url: 'https://www.bizplangenius.com/generate?tier=starter', price: 9700 };
  }
  if (tier === 'pro') {
    return { name: 'Business Plan (Pro)', url: 'https://www.bizplangenius.com/generate?tier=pro', price: 14700 };
  }

  // Fallback: try line items name
  const amount = session.amount_total || 0;
  if (amount > 0) {
    return {
      name: 'BizPlan Genius',
      url: 'https://www.bizplangenius.com',
      price: amount,
    };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle abandoned-cart event (session expired without payment)
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only send recovery if we have an email and the session was unpaid
    const email = session.customer_email || (session.customer_details?.email ?? null);
    if (!email) {
      return NextResponse.json({ received: true, skipped: 'no email' });
    }
    if (session.payment_status === 'paid') {
      return NextResponse.json({ received: true, skipped: 'already paid' });
    }

    const product = deriveProduct(session);
    if (!product) {
      return NextResponse.json({ received: true, skipped: 'unknown product' });
    }

    await sendAbandonedCartEmail({
      to: email,
      productName: product.name,
      productUrl: product.url,
      productPrice: product.price,
    });

    return NextResponse.json({ received: true, action: 'recovery_email_sent' });
  }

  // Other events: acknowledge silently
  return NextResponse.json({ received: true });
}
