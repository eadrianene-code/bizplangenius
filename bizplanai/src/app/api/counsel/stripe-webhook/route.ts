import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const maxDuration = 30;
export const runtime = 'nodejs';

/**
 * Stripe webhook handler for B2B counsel orders.
 *
 * Listens for:
 *   - checkout.session.completed: deposit cleared, fires production-start email to Adi
 *   - payment_intent.succeeded: backup signal in case checkout.session is missed
 *
 * Configure in Stripe dashboard:
 *   Endpoint: https://www.bizplangenius.com/api/counsel/stripe-webhook
 *   Events: checkout.session.completed, payment_intent.succeeded
 *   Secret: STRIPE_COUNSEL_WEBHOOK_SECRET (must be set as Vercel env var)
 */
export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_COUNSEL_WEBHOOK_SECRET;

  if (!secret) {
    console.error('[counsel-webhook] STRIPE_COUNSEL_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });

  // Verify signature
  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Signature verification failed';
    console.error('[counsel-webhook] signature verify failed:', msg);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`[counsel-webhook] received event: ${event.type} (${event.id})`);

  // Filter for counsel orders only (metadata.orderId starts with BPG-)
  // We accept BOTH event types because Stripe can fire either depending on
  // the payment method. payment_intent.succeeded is the more reliable signal
  // and carries metadata propagated via payment_intent_data.metadata.
  let meta: Record<string, string> = {};
  let amountPaidCents = 0;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    meta = (session.metadata || {}) as Record<string, string>;
    amountPaidCents = session.amount_total || 0;

    // If session metadata is empty (can happen with payment links), fall back
    // to retrieving the linked payment intent metadata
    if (!meta.orderId && session.payment_intent) {
      try {
        const piId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id;
        const pi = await stripe.paymentIntents.retrieve(piId);
        meta = (pi.metadata || {}) as Record<string, string>;
      } catch (err) {
        console.warn('[counsel-webhook] failed to retrieve payment intent metadata:', err);
      }
    }
  } else if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    meta = (pi.metadata || {}) as Record<string, string>;
    amountPaidCents = pi.amount_received || pi.amount || 0;
  } else {
    console.log(`[counsel-webhook] event type ${event.type} - skipping`);
    return NextResponse.json({ ignored: true, reason: 'unhandled-event-type' });
  }

  if (!meta.orderId || !meta.orderId.startsWith('BPG-')) {
    console.log(`[counsel-webhook] ignoring non-counsel order: ${meta.orderId || '(none)'}`);
    return NextResponse.json({ ignored: true, reason: 'non-counsel-order' });
  }

  // Single block of work for both event types from here on
  {

    const productionDeadline = new Date();
    productionDeadline.setDate(productionDeadline.getDate() + 5); // default 5 business days

    // Update Supabase order status
    try {
      const supa = getSupabaseAdmin();
      const { error: dbErr } = await supa
        .from('counsel_orders')
        .update({
          deposit_status: 'cleared',
          plan_status: 'in_production',
          deposit_cleared_at: new Date().toISOString(),
          production_deadline: productionDeadline.toISOString().slice(0, 10),
        })
        .eq('order_id', meta.orderId);
      if (dbErr) {
        console.error(`[counsel-webhook] supabase update failed for ${meta.orderId}:`, dbErr.message);
      }
    } catch (dbCatchErr) {
      console.error(`[counsel-webhook] supabase exception for ${meta.orderId}:`, dbCatchErr);
    }

 
    // Notify Adi
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'BizPlan Genius <hello@bizplangenius.com>',
          to: 'eadrianene@gmail.com',
          subject: `[DEPOSIT CLEARED] ${meta.orderId} - ${meta.firmName} - production clock started`,
          html: `
<h2>Deposit cleared - production clock started</h2>
<p><strong>Order:</strong> ${meta.orderId}</p>
<p><strong>Firm:</strong> ${meta.firmName}</p>
<p><strong>Visa:</strong> ${meta.visaCategory}</p>
<p><strong>Amount paid:</strong>$${(amountPaidCents / 100).toLocaleString()}</p>
<p><strong>Production deadline:</strong> ${productionDeadline.toISOString().slice(0, 10)} (5 business days)</p>
<h3>Action items</h3>
<ol>
  <li>Open Stripe dashboard and confirm payment received</li>
  <li>Find the original intake email (subject: "[NEW B2B ORDER] ${meta.orderId}")</li>
  <li>Use the intake JSON in that email to call /api/counsel/generate-uscis-plan</li>
  <li>Email the resulting .docx to ${meta.firmEmail || meta.firmName}</li>
  <li>Generate balance invoice in Stripe (50% of total fee)</li>
</ol>
          `,
        });
      } catch (err) {
        console.error('[counsel-webhook] notify failed:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
