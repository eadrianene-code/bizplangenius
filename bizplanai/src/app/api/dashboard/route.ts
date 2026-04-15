import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, email } = await req.json();

    if (!sessionId && !email) {
      return NextResponse.json({ error: 'Email or session ID required' }, { status: 400 });
    }

    const stripe = getStripe();
    let customerEmail = email;

    // If we have a session ID, get the email from the session
    if (sessionId && !email) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        customerEmail = session.customer_details?.email || session.metadata?.email || '';
      } catch {
        return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
      }
    }

    if (!customerEmail) {
      return NextResponse.json({ error: 'Could not determine email' }, { status: 400 });
    }

    // Look up all completed checkout sessions for this email
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
    });

    // Filter sessions by customer email
    const customerSessions = sessions.data.filter(s => {
      const sEmail = s.customer_details?.email?.toLowerCase() || s.metadata?.email?.toLowerCase() || '';
      return sEmail === customerEmail.toLowerCase();
    });

    // Build purchased products list
    const purchases: Array<{
      product: string;
      tier: string;
      date: string;
      amount: number;
      metadata: Record<string, string>;
      sessionId: string;
    }> = [];

    for (const session of customerSessions) {
      const meta = session.metadata || {};
      const amount = (session.amount_total || 0) / 100;
      const date = new Date((session.created || 0) * 1000).toISOString();

      // Determine product type from metadata or line items
      let product = 'unknown';
      let tier = '';

      if (meta.tier === 'starter' || meta.tier === 'pro') {
        product = 'business_plan';
        tier = meta.tier;
      } else if (meta.companyName || meta.industryDescription || meta.mode) {
        product = 'spy_report';
        tier = 'standard';
      }

      purchases.push({
        product,
        tier,
        date,
        amount,
        metadata: meta,
        sessionId: session.id,
      });
    }

    // Determine what products are available and recommended
    const hasPlan = purchases.some(p => p.product === 'business_plan');
    const hasProPlan = purchases.some(p => p.product === 'business_plan' && p.tier === 'pro');
    const hasSpy = purchases.some(p => p.product === 'spy_report');

    const available = [];

    if (!hasSpy) {
      available.push({
        product: 'spy_report',
        name: 'Competitor Spy Report',
        description: '10-15 real competitors analyzed with pricing, SWOT, vulnerability audit, and 90-day tactical roadmap',
        price: 19,
        url: '/spy',
        recommended: hasPlan, // If they have a plan, spy is the natural next step
      });
    }

    if (!hasPlan) {
      available.push({
        product: 'business_plan_starter',
        name: 'Business Plan (Starter)',
        description: '7-section business plan with real competitor data and market research',
        price: 29,
        url: '/generate?tier=starter',
        recommended: hasSpy, // If they have spy, plan is the natural next step
      });
      available.push({
        product: 'business_plan_pro',
        name: 'Business Plan (Pro)',
        description: 'Complete plan with Operations, Risk Analysis, and Money-Back Guarantee',
        price: 49,
        url: '/generate?tier=pro',
        recommended: hasSpy,
      });
    } else if (hasPlan && !hasProPlan) {
      available.push({
        product: 'business_plan_pro',
        name: 'Upgrade to Pro Plan',
        description: 'Add Operations Plan, Risk Analysis, and get our Money-Back Guarantee',
        price: 49,
        url: '/generate?tier=pro',
        recommended: true,
      });
    }

    // Future products (coming soon)
    available.push({
      product: 'website_builder',
      name: 'Website Builder',
      description: 'AI generates a working website based on your business plan',
      price: 99,
      url: '#',
      recommended: false,
      comingSoon: true,
    });

    available.push({
      product: 'pitch_deck',
      name: 'Pitch Deck Generator',
      description: 'Investor-ready slide deck generated from your business plan',
      price: 39,
      url: '#',
      recommended: false,
      comingSoon: true,
    });

    available.push({
      product: 'social_media_pack',
      name: 'Social Media Starter Pack',
      description: '30 days of platform-specific social posts for your business',
      price: 29,
      url: '#',
      recommended: false,
      comingSoon: true,
    });

    available.push({
      product: 'logo_brand_kit',
      name: 'Logo & Brand Kit',
      description: 'AI-generated logo, color palette, and brand guidelines',
      price: 29,
      url: '#',
      recommended: false,
      comingSoon: true,
    });

    return NextResponse.json({
      email: customerEmail.toLowerCase(),
      purchases,
      available,
      stats: {
        totalSpent: purchases.reduce((sum, p) => sum + p.amount, 0),
        productCount: purchases.length,
        hasPlan,
        hasProPlan,
        hasSpy,
      },
    });
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
