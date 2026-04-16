const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'BizPlan Genius <hello@bizplangenius.com>';

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set, skipping email:', { to, subject });
    return;
  }
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

export function abandonedCheckoutEmail(businessName: string): { subject: string; html: string } {
  return {
    subject: `You were 1 step away from your ${businessName} business plan`,
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #1a1a2e; margin: 0;">BizPlan Genius</h1>
  </div>

  <h2 style="font-size: 22px; color: #1a1a2e;">You were almost there.</h2>

  <p>You started creating a business plan for <strong>${businessName}</strong> but didn't finish checkout.</p>

  <p>Your business idea deserves a real plan with real competitor data, not guesses.</p>

  <div style="background: #f0f7ff; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; font-weight: bold; color: #1a1a2e;">What you'll get:</p>
    <ul style="margin: 0; padding-left: 20px; color: #555;">
      <li>5-10 real competitors analyzed</li>
      <li>3-year financial projections</li>
      <li>Investor-ready PDF download</li>
      <li>Real market data, not AI hallucinations</li>
    </ul>
  </div>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://www.bizplangenius.com/generate" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 16px;">
      Complete My Business Plan
    </a>
  </div>

  <p style="color: #888; font-size: 13px;">Not ready for a plan? Try our <a href="https://www.bizplangenius.com/free-competitor-check" style="color: #2563eb;">free competitor check</a> first.</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 11px; text-align: center;">
    BizPlan Genius | bizplangenius.com<br>
    <a href="https://www.bizplangenius.com" style="color: #aaa;">Unsubscribe</a>
  </p>
</body></html>`,
  };
}

export function welcomeEmail1(): { subject: string; html: string } {
  return {
    subject: 'Welcome to BizPlan Genius: here\'s what you can do',
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #1a1a2e;">BizPlan Genius</h1>
  </div>

  <h2 style="font-size: 22px; color: #1a1a2e;">Thanks for trying our free tool!</h2>

  <p>You've taken the first step. Here's what else you can do - all powered by AI with real market data:</p>

  <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0;">
    <p style="margin: 0 0 4px 0; font-weight: bold; color: #166534;">More free tools:</p>
    <p style="margin: 0; color: #555; font-size: 14px;">
      <a href="https://www.bizplangenius.com/free-competitor-check" style="color: #2563eb;">Competitor Check</a> |
      <a href="https://www.bizplangenius.com/validate-idea" style="color: #2563eb;">Idea Validator</a> |
      <a href="https://www.bizplangenius.com/business-name-generator" style="color: #2563eb;">Name Generator</a> |
      <a href="https://www.bizplangenius.com/startup-cost-calculator" style="color: #2563eb;">Cost Calculator</a> |
      <a href="https://www.bizplangenius.com/launch-checklist" style="color: #2563eb;">Launch Checklist</a>
    </p>
  </div>

  <p>When you're ready to get serious, our business plan starts at <strong>$29</strong> and includes real competitor research, financial projections, and an investor-ready PDF.</p>

  <div style="text-align: center; margin: 24px 0;">
    <a href="https://www.bizplangenius.com/generate" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold;">
      Generate My Business Plan - $29
    </a>
  </div>

  <p style="color: #888; font-size: 13px;">Reply to this email if you have any questions. We read every message.</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 11px; text-align: center;">BizPlan Genius | bizplangenius.com</p>
</body></html>`,
  };
}

export function welcomeEmail2(): { subject: string; html: string } {
  return {
    subject: 'Did you know? You can launch an entire business from one description',
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #1a1a2e;">BizPlan Genius</h1>
  </div>

  <h2 style="font-size: 22px; color: #1a1a2e;">Most people don't know this...</h2>

  <p>BizPlan Genius isn't just a business plan tool. You describe your business once, and our AI builds <strong>everything you need to launch</strong>:</p>

  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Competitor Research</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$19</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Business Plan</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$29</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Website (takes payments!)</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$99</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Pitch Deck (12 slides)</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$39</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Brand Kit (logo, colors)</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$29</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">30 days social posts</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$29</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Ad copy (Google, FB, IG)</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$19</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Legal pages (Terms, Privacy)</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$19</td></tr>
  </table>

  <p>Or get everything in the <strong>Full Business Kit for $349</strong> (save $25+).</p>

  <div style="text-align: center; margin: 24px 0;">
    <a href="https://www.bizplangenius.com/bundles" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold;">
      See Bundle Deals
    </a>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 11px; text-align: center;">BizPlan Genius | bizplangenius.com</p>
</body></html>`,
  };
}

export function welcomeEmail3(): { subject: string; html: string } {
  return {
    subject: 'Last chance: Your competitors aren\'t waiting',
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #1a1a2e;">BizPlan Genius</h1>
  </div>

  <h2 style="font-size: 22px; color: #1a1a2e;">Your competitors are already out there.</h2>

  <p>Every day you wait to launch, someone else is taking your future customers. The market doesn't wait for the perfect moment.</p>

  <p>Here's the thing: you don't need perfection. You need a <strong>plan, a website, and the confidence to start</strong>. We can give you all three in under 30 minutes.</p>

  <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 20px 0;">
    <p style="margin: 0; font-weight: bold; color: #92400e;">What most founders wish they knew earlier:</p>
    <p style="margin: 8px 0 0 0; color: #78350f; font-size: 14px;">
      The businesses that win aren't the ones with the best ideas. They're the ones that launched first.
    </p>
  </div>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://www.bizplangenius.com/generate" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 16px;">
      Start My Business Plan - $29
    </a>
  </div>

  <p style="text-align: center; color: #888; font-size: 13px;">
    Not sure yet? <a href="https://www.bizplangenius.com/free-competitor-check" style="color: #2563eb;">See who your competitors are</a> (free)
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 11px; text-align: center;">
    BizPlan Genius | bizplangenius.com<br>
    This is the last email in this sequence. We won't email you again unless you purchase.
  </p>
</body></html>`,
  };
}
