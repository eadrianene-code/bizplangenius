/**
 * B2B counsel email senders. Supplemental to the existing src/lib/email.ts
 * (which handles consumer plan delivery). Kept separate for clarity since
 * the B2B flow has different sender, signature, and content patterns.
 */

// Temporary: using theaurareport.com (verified in Resend) as the FROM domain.
// bizplangenius.com DKIM/SPF records exist in Porkbun but they belong to a
// different Resend project we lost access to. Until we resolve that, route
// outbound mail through theaurareport.com.
// Reply-To still points to bizplangenius.com so replies route correctly.
const COUNSEL_FROM_EMAIL = 'BizPlan Genius Counsel <hello@theaurareport.com>';
const COUNSEL_REPLY_TO = 'hello@bizplangenius.com';
const ADI_NOTIFICATION_EMAIL = 'eadrianene@gmail.com';

async function getResend() {
  const { Resend } = await import('resend');
  return new Resend(process.env.RESEND_API_KEY);
}

interface EngagementEmailArgs {
  to: string;
  attorneyName: string;
  firmName: string;
  orderId: string;
  visaCategoryLabel: string;
  investorName: string;
  depositAmount: number;
  totalAmount: number;
  productionDays: number;
  depositPaymentLink: string;
  engagementLetterBuffer: Buffer;
}

export async function sendEngagementEmail(args: EngagementEmailArgs): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email-counsel] RESEND_API_KEY missing, skipping engagement email');
    return;
  }

  const resend = await getResend();
  await resend.emails.send({
    from: COUNSEL_FROM_EMAIL,
    to: args.to,
    replyTo: COUNSEL_REPLY_TO,
    subject: `Engagement letter and deposit invoice - ${args.orderId}`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid #e2e8f0;">
              <div style="font-size:13px;color:#64748b;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">BizPlan Genius - Counsel Services</div>
              <div style="margin-top:8px;font-size:14px;color:#475569;">Order ${args.orderId}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;color:#1e293b;font-size:16px;">Hi ${args.attorneyName},</p>

              <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
                Thanks for engaging BizPlan Genius for the ${args.visaCategoryLabel} petition production for ${args.investorName}. Two things attached or below:
              </p>

              <ol style="margin:0 0 24px;padding-left:20px;color:#475569;font-size:15px;line-height:1.7;">
                <li><strong>Engagement letter (.docx attached)</strong>: Includes your e-signature record and the full deal terms. Save a copy to your matter file.</li>
                <li><strong>Stripe deposit invoice link</strong>: Pay by card, ACH, or wire. Production clock starts when this clears.</li>
              </ol>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:6px;margin:0 0 24px;">
                <tr><td style="padding:20px;">
                  <div style="font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;">Deposit due</div>
                  <div style="font-size:32px;font-weight:700;color:#1e293b;margin-top:4px;">$${args.depositAmount.toLocaleString()}</div>
                  <div style="font-size:13px;color:#64748b;margin-top:4px;">50% of total fee ($${args.totalAmount.toLocaleString()})</div>
                </td></tr>
              </table>

              ${args.depositPaymentLink
                ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;"><tr><td align="center"><a href="${args.depositPaymentLink}" style="display:inline-block;background-color:#1e40af;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;">Pay $${args.depositAmount.toLocaleString()} deposit via Stripe</a></td></tr></table>`
                : `<p style="margin:0 0 24px;padding:16px;background-color:#fef3c7;border:1px solid #fde68a;border-radius:6px;color:#78350f;font-size:14px;">Stripe invoice generation experienced a temporary issue. Adi will send you a payment link within 1 hour. No action needed from you in the meantime.</p>`
              }

              <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
                <strong>Production timeline:</strong> ${args.productionDays} business days from deposit clearance. You'll receive the white-labeled .docx plan via email when ready.
              </p>

              <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
                <strong>Need to update the engagement?</strong> Just reply to this email with corrections to the investor name, business details, or hiring plan. We'll update the order before production starts.
              </p>

              <p style="margin:24px 0 0;color:#475569;font-size:15px;line-height:1.6;">
                Adi<br/>
                Founder, BizPlan Genius<br/>
                <a href="mailto:hello@bizplangenius.com" style="color:#1e40af;">hello@bizplangenius.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                BizPlan Genius does not provide legal advice. Plans are produced for review and submission by licensed immigration counsel. The firm of record retains all responsibility for USCIS representation.
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
    attachments: [
      {
        filename: `engagement-letter-${args.orderId}.docx`,
        // Resend expects a base64 string for binary attachments. Passing
        // a raw Buffer can silently fail to encode in some SDK versions.
        content: args.engagementLetterBuffer.toString('base64'),
      },
    ],
  });
}

interface CounselOrderNotificationArgs {
  orderId: string;
  firmName: string;
  attorneyName: string;
  firmEmail: string;
  visaCategory: string;
  visaCategoryLabel: string;
  investorName: string;
  investorCountry: string;
  businessName: string;
  usLocation: string;
  totalPrice: number;
  depositPrice: number;
  rushProduction: boolean;
  productionDays: number;
  depositPaymentLink: string;
  intakeData: Record<string, unknown>;
}

export async function sendCounselOrderNotification(args: CounselOrderNotificationArgs): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const resend = await getResend();
  const intakeJson = JSON.stringify(args.intakeData, null, 2);

  await resend.emails.send({
    from: COUNSEL_FROM_EMAIL,
    to: ADI_NOTIFICATION_EMAIL,
    subject: `[NEW B2B ORDER] ${args.orderId} - ${args.firmName} - ${args.visaCategory} - $${args.totalPrice}`,
    html: `
<h2>New B2B counsel order</h2>
<p><strong>Order ID:</strong> ${args.orderId}</p>
<p><strong>Total fee:</strong> $${args.totalPrice.toLocaleString()} (deposit: $${args.depositPrice.toLocaleString()})</p>
<p><strong>Production days:</strong> ${args.productionDays} ${args.rushProduction ? '(RUSH)' : ''}</p>

<h3>Firm</h3>
<ul>
  <li>${args.firmName}</li>
  <li>${args.attorneyName} &lt;${args.firmEmail}&gt;</li>
</ul>

<h3>Petitioner</h3>
<ul>
  <li>${args.investorName} (${args.investorCountry})</li>
  <li>${args.visaCategoryLabel}</li>
  <li>${args.businessName} - ${args.usLocation}</li>
</ul>

<h3>Stripe deposit link</h3>
<p>${args.depositPaymentLink ? `<a href="${args.depositPaymentLink}">${args.depositPaymentLink}</a>` : '<strong>FAILED to generate - send manual invoice</strong>'}</p>

<h3>Next steps</h3>
<ol>
  <li>Watch Stripe webhook for deposit clearance</li>
  <li>On clearance: ${args.productionDays}-day production clock starts</li>
  <li>Use /api/counsel/generate-uscis-plan with this intake to produce the plan</li>
  <li>Email plan to ${args.firmEmail} when ready</li>
  <li>Generate balance invoice ($${(args.totalPrice - args.depositPrice).toLocaleString()})</li>
</ol>

<h3>Full intake JSON</h3>
<pre style="background:#f3f4f6;padding:12px;border-radius:6px;font-size:11px;overflow:auto;max-height:400px;">${intakeJson.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] || c))}</pre>
    `,
  });
}
