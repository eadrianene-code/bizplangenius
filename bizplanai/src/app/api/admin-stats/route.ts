import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function POST(req: NextRequest) {
  const authKey = req.headers.get('x-tools-key');
  if (authKey !== process.env.TOOLS_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get collected emails
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'collected-emails.json');
    let emails: Array<{ email: string; source: string; timestamp: string }> = [];
    if (fs.existsSync(filePath)) {
      emails = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    // Get Stripe revenue data
    const stripe = getStripe();
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
    });

    const sales = sessions.data.map(s => ({
      email: s.customer_details?.email || s.metadata?.email || 'unknown',
      amount: (s.amount_total || 0) / 100,
      product: s.metadata?.tier ? 'business_plan' : 'spy_report',
      tier: s.metadata?.tier || 'standard',
      date: new Date((s.created || 0) * 1000).toISOString(),
      businessName: s.metadata?.businessName || s.metadata?.companyName || 'N/A',
    }));

    const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
    const totalSales = sales.length;

    // Email sources breakdown
    const sourceBreakdown: Record<string, number> = {};
    for (const e of emails) {
      const src = e.source || 'unknown';
      sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
    }

    // Emails by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEmails = emails.filter(e => new Date(e.timestamp) >= thirtyDaysAgo);

    return NextResponse.json({
      emails: {
        total: emails.length,
        recent30d: recentEmails.length,
        list: emails.slice(-50).reverse(), // Last 50 emails, newest first
        sourceBreakdown,
      },
      sales: {
        total: totalSales,
        totalRevenue,
        list: sales.slice(0, 20), // Last 20 sales
      },
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
