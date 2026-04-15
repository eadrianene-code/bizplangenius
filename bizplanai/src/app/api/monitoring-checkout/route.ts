import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, plan, spySessionId } = await req.json();

    if (!email || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || 'https://www.bizplangenius.com';
    const baseUrl = origin.replace(/\/$/, '');

    const plans: Record<string, { name: string; price: number; interval: 'month' | 'year' }> = {
      monitoring_monthly: {
        name: 'Competitor Monitoring - Monthly',
        price: 1500, // $15/month
        interval: 'month',
      },
      monitoring_yearly: {
        name: 'Competitor Monitoring - Yearly',
        price: 10800, // $108/year ($9/month equivalent)
        interval: 'year',
      },
      social_monthly: {
        name: 'Monthly Social Media Pack',
        price: 1900, // $19/month
        interval: 'month',
      },
      social_yearly: {
        name: 'Monthly Social Media Pack - Yearly',
        price: 14400, // $144/year ($12/month equivalent)
        interval: 'year',
      },
    };

    const selectedPlan = plans[plan];
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const stripe = getStripe();

    // Check if customer already exists
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({ email });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPlan.name,
            },
            unit_amount: selectedPlan.price,
            recurring: {
              interval: selectedPlan.interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/monitoring?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/monitoring`,
      metadata: {
        product: 'subscription',
        subscriptionType: plan,
        email,
        spySessionId: spySessionId || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Monitoring checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
