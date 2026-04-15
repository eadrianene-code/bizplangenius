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
      } else if (meta.product === 'website_builder') {
        product = 'website_builder';
        tier = meta.websiteType || 'landing';
      } else if (meta.product === 'pitch_deck') {
        product = 'pitch_deck';
        tier = 'standard';
      } else if (meta.product === 'social_media_pack') {
        product = 'social_media_pack';
        tier = 'standard';
      } else if (meta.product === 'brand_kit') {
        product = 'brand_kit';
        tier = 'standard';
      } else if (meta.product === 'investor_emails') {
        product = 'investor_emails';
        tier = 'standard';
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

    // Website builder -- available if they have a plan
    const hasWebsite = purchases.some(p => p.product === 'website_builder');
    const planSession = purchases.find(p => p.product === 'business_plan');
    if (!hasWebsite && hasPlan && planSession) {
      available.push({
        product: 'website_builder',
        name: 'Website Builder',
        description: 'AI generates a custom, professional website from your business plan. Full source code included.',
        price: 99,
        url: `/build-website?plan_session_id=${planSession.sessionId}`,
        recommended: true,
      });
    } else if (!hasWebsite && !hasPlan) {
      available.push({
        product: 'website_builder',
        name: 'Website Builder',
        description: 'AI generates a working website based on your business plan. Requires a business plan.',
        price: 99,
        url: '/build-website',
        recommended: false,
        requiresPlan: true,
      });
    }

    // Pitch deck -- available if they have a plan
    const hasDeck = purchases.some(p => p.product === 'pitch_deck');
    if (!hasDeck && hasPlan && planSession) {
      available.push({
        product: 'pitch_deck',
        name: 'Pitch Deck Generator',
        description: '12-slide investor-ready pitch deck with speaker notes, built from your plan data',
        price: 39,
        url: `/pitch-deck?plan_session_id=${planSession.sessionId}`,
        recommended: hasWebsite,
      });
    } else if (!hasDeck && !hasPlan) {
      available.push({
        product: 'pitch_deck',
        name: 'Pitch Deck Generator',
        description: 'Investor-ready slide deck generated from your business plan. Requires a business plan.',
        price: 39,
        url: '/pitch-deck',
        recommended: false,
        requiresPlan: true,
      });
    }

    // Social media pack
    const hasSocialPack = purchases.some(p => p.product === 'social_media_pack');
    if (!hasSocialPack && hasPlan && planSession) {
      available.push({
        product: 'social_media_pack',
        name: 'Social Media Starter Pack',
        description: '30 days of ready-to-post content for Twitter, LinkedIn, Instagram, and Facebook',
        price: 29,
        url: `/social-pack?plan_session_id=${planSession.sessionId}`,
        recommended: false,
      });
    } else if (!hasSocialPack && !hasPlan) {
      available.push({
        product: 'social_media_pack',
        name: 'Social Media Starter Pack',
        description: '30 days of social posts for your business. Requires a business plan.',
        price: 29,
        url: '/social-pack',
        recommended: false,
        requiresPlan: true,
      });
    }

    // Brand kit
    const hasBrandKit = purchases.some(p => p.product === 'brand_kit');
    if (!hasBrandKit && hasPlan && planSession) {
      available.push({
        product: 'brand_kit',
        name: 'Logo & Brand Kit',
        description: 'AI-generated logo concepts, color palette, typography, and brand voice guidelines',
        price: 29,
        url: `/brand-kit?plan_session_id=${planSession.sessionId}`,
        recommended: false,
      });
    } else if (!hasBrandKit && !hasPlan) {
      available.push({
        product: 'brand_kit',
        name: 'Logo & Brand Kit',
        description: 'Brand identity kit. Requires a business plan.',
        price: 29,
        url: '/brand-kit',
        recommended: false,
        requiresPlan: true,
      });
    }

    // Investor emails
    const hasInvestorEmails = purchases.some(p => p.product === 'investor_emails');
    if (!hasInvestorEmails && hasPlan && planSession) {
      available.push({
        product: 'investor_emails',
        name: 'Investor Email Templates',
        description: '10 personalized fundraising emails: cold outreach, follow-ups, intros, and updates',
        price: 19,
        url: `/investor-emails?plan_session_id=${planSession.sessionId}`,
        recommended: false,
      });
    } else if (!hasInvestorEmails && !hasPlan) {
      available.push({
        product: 'investor_emails',
        name: 'Investor Email Templates',
        description: '10 fundraising email templates. Requires a business plan.',
        price: 19,
        url: '/investor-emails',
        recommended: false,
        requiresPlan: true,
      });
    }

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
