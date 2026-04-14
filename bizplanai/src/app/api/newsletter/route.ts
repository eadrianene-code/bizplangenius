import { NextResponse } from 'next/server';

// Newsletter signup handler.
// TODO (2026-04-15): Wire to Resend audience once RESEND_API_KEY is added to Vercel env.
// For now we log the email + source to Vercel logs so nothing is lost.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const source = typeof body?.source === 'string' ? body.source.slice(0, 64) : 'unknown';

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }

    // Log to Vercel so we can harvest signups until Resend is wired up.
    console.log(JSON.stringify({ type: 'newsletter_signup', email, source, ts: new Date().toISOString() }));

    // If Resend is configured, broadcast it. Safe no-op when the env var is missing.
    const resendKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (resendKey && audienceId) {
      try {
        await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({ email, unsubscribed: false }),
        });
      } catch (err) {
        console.error('Resend contact sync failed:', err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Newsletter route error:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
