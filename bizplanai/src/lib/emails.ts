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

// Email 1 of 3 - sent 1 hour after abandonment. Soft nudge, focus on what they miss.
export function abandonedCheckoutEmail(businessName: string): { subject: string; html: string } {
  return {
    subject: `Your ${businessName} plan is waiting (and the website builds itself next)`,
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #1a1a2e; margin: 0;">BizPlan Genius</h1>
  </div>

  <h2 style="font-size: 22px; color: #1a1a2e;">You were almost there.</h2>

  <p>You started creating a business plan for <strong>${businessName}</strong> but didn't finish checkout.</p>

  <p>Here's what most people miss: once your plan is generated, one click turns it into your actual website. Homepage copy, pricing page, and about page all built from your plan data. No re-entry. No copywriter. No Squarespace.</p>

  <div style="background: #f0f7ff; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; font-weight: bold; color: #1a1a2e;">What you get with ${businessName}:</p>
    <ul style="margin: 0; padding-left: 20px; color: #555;">
      <li>5-10 real competitors analyzed (not AI-guessed)</li>
      <li>3-year financial projections based on real industry margins</li>
      <li>Investor-ready PDF download</li>
      <li>One-click website generation from the same plan data</li>
    </ul>
  </div>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://www.bizplangenius.com/generate" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 16px;">
      Finish My Business Plan
    </a>
  </div>

  <p style="color: #888; font-size: 13px;">Not sure yet? See how the plan-to-website flow works at <a href="https://www.bizplangenius.com/build-website" style="color: #2563eb;">bizplangenius.com/build-website</a>.</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 11px; text-align: center;">
    BizPlan Genius | bizplangenius.com<br>
    <a href="https://www.bizplangenius.com" style="color: #aaa;">Unsubscribe</a>
  </p>
</body></html>`,
  };
}

// Email 2 of 3 - sent 24 hours after abandonment. Objection-handler: compare to alternatives.
export function abandonedCheckoutEmail2(businessName: string): { subject: string; html: string } {
  return {
    subject: `${businessName}: $147 vs $3,000 (here's what you're actually comparing)`,
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #1a1a2e; margin: 0;">BizPlan Genius</h1>
  </div>

  <h2 style="font-size: 22px; color: #1a1a2e;">Thought about ${businessName} overnight?</h2>

  <p>Most founders stall on checkout because they're unsure if our \$97-\$147 plan is "real enough." Fair question. Here's the honest comparison:</p>

  <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
    <tr style="background: #f8fafc;">
      <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Option</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Cost</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Time</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">Hire a business plan consultant</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">\$2,000 - \$10,000</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">2 - 4 weeks</td>
    </tr>
    <tr style="background: #f8fafc;">
      <td style="padding: 12px; border: 1px solid #e2e8f0;">Write it yourself + freelancer for website</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">\$500 - \$2,000</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">3 - 6 weeks</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">ChatGPT prompt + manual cleanup</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">\$20/mo + your time</td>
      <td style="padding: 12px; border: 1px solid #e2e8f0;">Days of revisions</td>
    </tr>
    <tr style="background: #e0f2fe;">
      <td style="padding: 12px; border: 1px solid #60a5fa; font-weight: bold;">BizPlan Genius Pro + Website</td>
      <td style="padding: 12px; border: 1px solid #60a5fa; font-weight: bold;">\$246</td>
      <td style="padding: 12px; border: 1px solid #60a5fa; font-weight: bold;">Under 1 hour</td>
    </tr>
  </table>

  <p>We use Google Gemini with live web search grounding. That means the competitor data, pricing benchmarks, and market sizing in your plan are pulled from the actual web at generation time, not from an AI's 2024 training data.</p>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://www.bizplangenius.com/generate?tier=pro" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 16px;">
      Get ${businessName} Plan Pro - \$147
    </a>
  </div>

  <p style="color: #555; font-size: 14px;">Pro tier includes our 100% money-back guarantee. If the plan isn't usable, you get a full refund.</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 11px; text-align: center;">
    BizPlan Genius | bizplangenius.com<br>
    <a href="https://www.bizplangenius.com" style="color: #aaa;">Unsubscribe</a>
  </p>
</body></html>`,
  };
}

// Email 3 of 3 - sent 72 hours after abandonment. Last touch, offer a discount, close the loop.
export function abandonedCheckoutEmail3(businessName: string): { subject: string; html: string } {
  return {
    subject: `Last nudge on ${businessName} (20% off inside)`,
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #1a1a2e; margin: 0;">BizPlan Genius</h1>
  </div>

  <h2 style="font-size: 22px; color: #1a1a2e;">Last ping about ${businessName}.</h2>

  <p>It's been a few days since you started your plan and didn't finish. No hard sell, just one offer on the way out:</p>

  <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
    <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">One-time code, 7 days to use</p>
    <p style="margin: 0 0 12px 0; font-size: 28px; font-weight: bold; color: #1a1a2e; letter-spacing: 2px;">SCORE20</p>
    <p style="margin: 0; font-size: 14px; color: #555;">20% off any business plan tier. Works on Starter, Pro, or the Launch Pack.</p>
  </div>

  <p>If ${businessName} was a passing thought, feel free to ignore. If it's still rattling around your head at 11pm, that's the idea worth finishing the plan for.</p>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://www.bizplangenius.com/generate?tier=pro" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 16px;">
      Finish ${businessName} Plan (20% off)
    </a>
  </div>

  <p style="color: #888; font-size: 13px; text-align: center;">This is the last email about this specific plan. You will not get a 4th.</p>

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

  <p>When you're ready to get serious, our business plan starts at <strong>$97</strong> and includes real competitor research, financial projections, and an investor-ready PDF.</p>

  <div style="text-align: center; margin: 24px 0;">
    <a href="https://www.bizplangenius.com/generate" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold;">
      Generate My Business Plan - $97
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
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Competitor Research</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$97</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Business Plan</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$97</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Website (takes payments!)</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$99</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Pitch Deck (12 slides)</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$39</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Brand Kit (logo, colors)</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$29</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">30 days social posts</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$29</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Ad copy (Google, FB, IG)</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$19</td></tr>
    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Legal pages (Terms, Privacy)</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$19</td></tr>
  </table>

  <p>Or get everything in the <strong>Full Business Kit for $397</strong> (save $43+).</p>

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
      Start My Business Plan - $97
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
