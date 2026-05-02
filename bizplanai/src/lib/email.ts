const FROM_EMAIL = 'BizPlan Genius <hello@bizplangenius.com>';
const REPLY_TO = 'support@bizplangenius.com';

async function getResend() {
  const { Resend } = await import('resend');
  return new Resend(process.env.RESEND_API_KEY);
}

/* ------------------------------------------------------------------ */
/*  Business Plan delivery email                                       */
/* ------------------------------------------------------------------ */

export async function sendPlanDeliveryEmail({
  to,
  businessName,
  tier,
}: {
  to: string;
  businessName: string;
  tier: 'starter' | 'pro';
}) {
  if (!to || !process.env.RESEND_API_KEY) return;

  const planLabel = tier === 'pro' ? 'Pro' : 'Starter';

  try {
    const resend = await getResend();
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject: `Your ${planLabel} Business Plan is Ready - ${businessName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 32px 40px; text-align: center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">BizPlan Genius</h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">AI-Powered Business Plans with Real Market Data</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1e293b;font-size:20px;">Your ${planLabel} Business Plan is Ready!</h2>

              <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px;">
                Great news - your business plan for <strong>${businessName}</strong> has been generated with real competitor research and market data.
              </p>

              <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Your plan is waiting for you on the results page. If you haven't downloaded the PDF yet, head back to grab it.
              </p>

              <!-- What's included -->
              <div style="background-color:#f0f9ff;border-radius:8px;padding:20px;margin:0 0 24px;">
                <h3 style="margin:0 0 12px;color:#1e40af;font-size:16px;">What's in your ${planLabel} plan:</h3>
                <ul style="margin:0;padding:0 0 0 20px;color:#475569;font-size:14px;line-height:1.8;">
                  <li>Executive Summary with key metrics</li>
                  <li>Real competitor analysis (5-10 companies)</li>
                  <li>Market analysis with TAM/SAM/SOM data</li>
                  <li>Marketing strategy with 90-day launch plan</li>
                  <li>3-year financial projections</li>
                  ${tier === 'pro' ? '<li>Operations plan with milestones</li><li>Risk analysis with mitigation strategies</li>' : ''}
                </ul>
              </div>

              ${tier === 'starter' ? `
              <!-- Upgrade CTA for Starter -->
              <div style="background-color:#fef3c7;border-radius:8px;padding:20px;margin:0 0 24px;border-left:4px solid #f59e0b;">
                <h3 style="margin:0 0 8px;color:#92400e;font-size:16px;">Want the full picture?</h3>
                <p style="margin:0;color:#78350f;font-size:14px;line-height:1.6;">
                  Upgrade to the Pro plan to get an Operations Plan, Risk Analysis, and our Money-Back Guarantee.
                  <a href="https://www.bizplangenius.com/generate" style="color:#1e40af;text-decoration:underline;">Upgrade now</a>
                </p>
              </div>
              ` : `
              <!-- Pro guarantee -->
              <div style="background-color:#ecfdf5;border-radius:8px;padding:20px;margin:0 0 24px;border-left:4px solid #10b981;">
                <h3 style="margin:0 0 8px;color:#065f46;font-size:16px;">Money-Back Guarantee</h3>
                <p style="margin:0;color:#047857;font-size:14px;line-height:1.6;">
                  Not satisfied? Reply to this email within 7 days for a full refund. No questions asked.
                </p>
              </div>
              `}

              <!-- Spy cross-sell -->
              <div style="background-color:#f5f3ff;border-radius:8px;padding:20px;margin:0 0 24px;">
                <h3 style="margin:0 0 8px;color:#5b21b6;font-size:16px;">Go deeper with Competitor Spy ($97)</h3>
                <p style="margin:0 0 12px;color:#6d28d9;font-size:14px;line-height:1.6;">
                  Get a detailed analysis of 10-15 real competitors with SWOT breakdowns, pricing intel, vulnerability audits, and a 90-day tactical roadmap.
                </p>
                <a href="https://www.bizplangenius.com/spy" style="display:inline-block;background-color:#7c3aed;color:#ffffff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Get Your Competitor Report</a>
              </div>

              <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:24px 0 0;">
                Questions? Just reply to this email. We read every message.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#f1f5f9;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                BizPlan Genius - AI Business Plans with Real Market Data
                <br>
                <a href="https://www.bizplangenius.com" style="color:#64748b;text-decoration:underline;">bizplangenius.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
    console.log(`Plan delivery email sent to ${to}`);
  } catch (err) {
    // Don't fail the request if email fails
    console.error('Failed to send plan delivery email:', err);
  }
}

/* ------------------------------------------------------------------ */
/*  Competitor Spy delivery email                                      */
/* ------------------------------------------------------------------ */

export async function sendSpyDeliveryEmail({
  to,
  reportName,
  mode,
}: {
  to: string;
  reportName: string;
  mode: 'company' | 'industry';
}) {
  if (!to || !process.env.RESEND_API_KEY) return;

  const subjectName = mode === 'company' ? reportName : `the ${reportName} industry`;

  try {
    const resend = await getResend();
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject: `Your Competitor Spy Report is Ready - ${reportName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #5b21b6, #7c3aed); padding: 32px 40px; text-align: center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Competitor Spy</h1>
              <p style="margin:8px 0 0;color:#ddd6fe;font-size:14px;">by BizPlan Genius</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1e293b;font-size:20px;">Your Competitor Report is Ready!</h2>

              <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 16px;">
                Your competitive intelligence report on <strong>${subjectName}</strong> has been generated with real-time web research.
              </p>

              <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Head back to your results page to view the full report and download the PDF.
              </p>

              <!-- What's included -->
              <div style="background-color:#f5f3ff;border-radius:8px;padding:20px;margin:0 0 24px;">
                <h3 style="margin:0 0 12px;color:#5b21b6;font-size:16px;">What's in your report:</h3>
                <ul style="margin:0;padding:0 0 0 20px;color:#475569;font-size:14px;line-height:1.8;">
                  <li>10-15 real competitors analyzed</li>
                  <li>Pricing and business model breakdowns</li>
                  <li>SWOT analysis for each competitor</li>
                  <li>Vulnerability audit - where they're weak</li>
                  <li>90-day tactical roadmap to exploit gaps</li>
                </ul>
              </div>

              <!-- Biz plan cross-sell -->
              <div style="background-color:#eff6ff;border-radius:8px;padding:20px;margin:0 0 24px;">
                <h3 style="margin:0 0 8px;color:#1e40af;font-size:16px;">Ready to build the full plan? Save $10</h3>
                <p style="margin:0 0 12px;color:#1e3a5f;font-size:14px;line-height:1.6;">
                  Turn your competitive insights into an investor-ready business plan with real financial projections and marketing strategy. Use code <strong>SAMPLE10</strong> for $30 off.
                </p>
                <a href="https://www.bizplangenius.com/generate" style="display:inline-block;background-color:#1e40af;color:#ffffff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Create Your Business Plan</a>
              </div>

              <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:24px 0 0;">
                Questions? Just reply to this email. We read every message.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#f1f5f9;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                BizPlan Genius - AI Business Plans with Real Market Data
                <br>
                <a href="https://www.bizplangenius.com" style="color:#64748b;text-decoration:underline;">bizplangenius.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
    console.log(`Spy delivery email sent to ${to}`);
  } catch (err) {
    console.error('Failed to send spy delivery email:', err);
  }
}

/* ------------------------------------------------------------------ */
/*  Abandoned cart recovery email                                      */
/* ------------------------------------------------------------------ */

interface AbandonedCartParams {
  to: string;
  productName: string;
  productUrl: string;
  productPrice: number; // in cents
}

export async function sendAbandonedCartEmail({
  to,
  productName,
  productUrl,
  productPrice,
}: AbandonedCartParams) {
  if (!to || !process.env.RESEND_API_KEY) return;

  const priceUsd = (productPrice / 100).toFixed(0);
  const discountedUsd = Math.max(0, (productPrice - 3000) / 100).toFixed(0);

  try {
    const resend = await getResend();
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject: `Your ${productName} is one click away (and here is $30 off)`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 28px 40px; text-align: center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">BizPlan Genius</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 16px;color:#1e293b;font-size:22px;line-height:1.3;">You were a click away from your ${productName}.</h2>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 20px;">
            Something pulled you away. Happens. The form data is still there, and so are the real competitor names, market data, and projections waiting to be generated.
          </p>
          <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">
            To make it easier, here is a one-time discount: <strong>$30 off</strong> with code <strong style="background:#fef3c7;padding:2px 8px;border-radius:4px;">SAMPLE10</strong> at checkout. That brings your total to <strong>$${discountedUsd}</strong> instead of $${priceUsd}.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${productUrl}?coupon=SAMPLE10" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:16px;">
              Finish My ${productName} - $${discountedUsd}
            </a>
          </div>
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:24px 0 0;">
            Code expires in 48 hours. One-time use. No subscription, ever.
          </p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;">
          <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0;">
            Why founders pick us over consultants and ChatGPT: real competitor research from live web data, not made-up competitors. 3-year financial projections grounded in actual industry benchmarks. PDF in 10 minutes, not 4 weeks. <a href="https://www.bizplangenius.com/methodology" style="color:#2563eb;">See our methodology &rarr;</a>
          </p>
        </td></tr>
        <tr><td style="background-color:#f1f5f9;padding:20px 40px;text-align:center;">
          <p style="margin:0;color:#94a3b8;font-size:13px;">
            BizPlan Genius &middot; <a href="https://www.bizplangenius.com" style="color:#64748b;text-decoration:none;">bizplangenius.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    });
    console.log(`Abandoned cart email sent to ${to} for ${productName}`);
  } catch (err) {
    console.error('Failed to send abandoned cart email:', err);
  }
}
