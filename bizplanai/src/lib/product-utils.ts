// Shared utility for product checkout and generation routes
// Allows products to work with either a planSessionId OR direct business details

import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

export interface BusinessDetails {
  businessName: string;
  industry: string;
  description: string;
  targetMarket: string;
  revenueModel: string;
  location: string;
}

/**
 * Get business details from multiple sources in priority order:
 * 1. The checkout session's own metadata (standalone purchase)
 * 2. The plan session metadata (plan-linked purchase)
 * 3. Direct body params (fallback)
 */
export async function getBusinessDetailsFromSession(sessionId: string, planSessionId?: string): Promise<BusinessDetails> {
  const stripe = getStripe();

  // First try: checkout session's own metadata
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const meta = session.metadata || {};
    if (meta.businessName) {
      return {
        businessName: meta.businessName || 'My Business',
        industry: meta.industry || '',
        description: meta.description || '',
        targetMarket: meta.targetMarket || '',
        revenueModel: meta.revenueModel || '',
        location: meta.location || '',
      };
    }
  } catch {}

  // Second try: plan session metadata
  if (planSessionId) {
    try {
      const planSession = await stripe.checkout.sessions.retrieve(planSessionId);
      const meta = planSession.metadata || {};
      return {
        businessName: meta.businessName || 'My Business',
        industry: meta.industry || '',
        description: meta.description || '',
        targetMarket: meta.targetMarket || '',
        revenueModel: meta.revenueModel || '',
        location: meta.location || '',
      };
    } catch {}
  }

  return {
    businessName: 'My Business',
    industry: '',
    description: '',
    targetMarket: '',
    revenueModel: '',
    location: '',
  };
}

export async function getBusinessDetails(body: any): Promise<BusinessDetails> {
  if (body.planSessionId) {
    const stripe = getStripe();
    try {
      const session = await stripe.checkout.sessions.retrieve(body.planSessionId);
      const meta = session.metadata || {};
      return {
        businessName: meta.businessName || body.businessName || 'My Business',
        industry: meta.industry || body.industry || '',
        description: meta.description || body.description || '',
        targetMarket: meta.targetMarket || body.targetMarket || '',
        revenueModel: meta.revenueModel || body.revenueModel || '',
        location: meta.location || body.location || '',
      };
    } catch {}
  }

  return {
    businessName: body.businessName || 'My Business',
    industry: body.industry || '',
    description: body.description || '',
    targetMarket: body.targetMarket || '',
    revenueModel: body.revenueModel || '',
    location: body.location || '',
  };
}

export function buildCheckoutMetadata(body: any): Record<string, string> {
  const meta: Record<string, string> = {};
  if (body.planSessionId) meta.planSessionId = body.planSessionId;
  if (body.email) meta.email = body.email;
  if (body.businessName) meta.businessName = (body.businessName || '').substring(0, 500);
  if (body.industry) meta.industry = body.industry;
  if (body.description) meta.description = (body.description || '').substring(0, 500);
  if (body.targetMarket) meta.targetMarket = (body.targetMarket || '').substring(0, 500);
  if (body.revenueModel) meta.revenueModel = body.revenueModel;
  if (body.location) meta.location = body.location;
  return meta;
}
