import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProduct, getBundleProducts } from '@/lib/products';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

interface CheckoutBody {
  productId: string;
  email: string;
  businessName?: string;
  businessDescription?: string;
  // For subscriptions: 'monthly' or 'yearly', defaults to 'monthly'
  billingCycle?: 'monthly' | 'yearly';
  // Additional metadata fields
  [key: string]: string | undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();

    // Validate required fields
    const { productId, email } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      );
    }

    // Get product configuration
    const product = getProduct(productId);

    if (!product) {
      return NextResponse.json(
        { error: `Product not found: ${productId}` },
        { status: 404 }
      );
    }

    // Derive base URL from the request origin (works with any domain)
    const origin =
      req.headers.get('origin') ||
      req.headers.get('referer')?.replace(/\/[^/]*$/, '') ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://www.bizplangenius.com';
    const baseUrl = origin.replace(/\/$/, ''); // Remove trailing slash

    // Build metadata object (only include provided fields)
    const metadata: Record<string, string> = {
      productId,
      email,
    };

    if (body.businessName) {
      metadata.businessName = body.businessName.substring(0, 500); // Stripe metadata limit
    }

    if (body.businessDescription) {
      metadata.businessDescription = body.businessDescription.substring(0, 500);
    }

    // Add any additional metadata fields (exclude reserved keys)
    const reservedKeys = ['productId', 'email', 'businessName', 'businessDescription', 'billingCycle'];
    for (const [key, value] of Object.entries(body)) {
      if (value && !reservedKeys.includes(key) && typeof value === 'string') {
        metadata[key] = value.substring(0, 500);
      }
    }

    // Handle different product categories
    if (product.category === 'subscription') {
      return handleSubscriptionCheckout(
        product,
        email,
        baseUrl,
        metadata,
        body.billingCycle
      );
    } else {
      // Individual products and bundles
      return handlePaymentCheckout(
        product,
        productId,
        email,
        baseUrl,
        metadata
      );
    }
  } catch (error: any) {
    console.error('Universal checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentCheckout(
  product: any,
  productId: string,
  email: string,
  baseUrl: string,
  metadata: Record<string, string>
) {
  // Build line items for bundles (include component products)
  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (product.category === 'bundle' && product.bundleIncludes) {
    // For bundles, include the bundle product itself with the discounted price
    lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ];

    // Add bundle includes to metadata for fulfillment tracking
    metadata.bundleProducts = product.bundleIncludes.join(',');
  } else {
    // Individual product
    lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ];
  }

  // Determine success and cancel URLs
  const successUrl = `${baseUrl}${product.successUrl}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}${product.pageUrl || '/'}`;

  // Create Stripe Checkout session
  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: email,
    line_items: lineItems,
    mode: 'payment',
    allow_promotion_codes: true,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });

  return NextResponse.json({ url: session.url });
}

async function handleSubscriptionCheckout(
  product: any,
  email: string,
  baseUrl: string,
  metadata: Record<string, string>,
  billingCycle?: 'monthly' | 'yearly'
) {
  // Default to monthly if not specified
  const cycle = billingCycle === 'yearly' ? 'yearly' : 'monthly';
  const unitAmount = cycle === 'yearly' ? product.yearlyPrice : product.monthlyPrice;

  if (!unitAmount) {
    return NextResponse.json(
      { error: `Subscription pricing not configured for ${cycle}` },
      { status: 400 }
    );
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: unitAmount,
        recurring: {
          interval: cycle === 'yearly' ? 'year' : 'month',
          interval_count: 1,
        },
      },
      quantity: 1,
    },
  ];

  const successUrl = `${baseUrl}${product.successUrl}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}${product.pageUrl || '/'}`;

  // Add billing cycle to metadata
  metadata.billingCycle = cycle;

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: email,
    line_items: lineItems,
    mode: 'subscription',
    allow_promotion_codes: true,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });

  return NextResponse.json({ url: session.url });
}
