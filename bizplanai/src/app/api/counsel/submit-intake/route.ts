import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { generateEngagementLetterDocx } from '@/lib/engagement-letter';
import {
  sendEngagementEmail,
  sendCounselOrderNotification,
} from '@/lib/email-counsel';

export const maxDuration = 60;
export const runtime = 'nodejs';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

const VISA_PRICING: Record<string, { label: string; basePrice: number }> = {
  'E-2': { label: 'E-2 Treaty Investor', basePrice: 1500 },
  'L-1': { label: 'L-1A Intracompany Transferee', basePrice: 1500 },
  'O-1': { label: 'O-1 Extraordinary Ability', basePrice: 1500 },
  'EB-5': { label: 'EB-5 Immigrant Investor', basePrice: 2500 },
  'EB-2-NIW': { label: 'EB-2 National Interest Waiver', basePrice: 1500 },
};

interface SubmitBody {
  attorneyName: string;
  firmName: string;
  firmEmail: string;
  firmPhone: string;
  barAdmissionState: string;
  investorName: string;
  investorCountry: string;
  visaCategory: string;
  investmentAmount: number;
  businessConcept: string;
  businessName: string;
  industry: string;
  naicsCode: string;
  usLocation: string;
  usState: string;
  sourceOfFundsSummary: string;
  existingUsEntity: boolean;
  usEntityName: string;
  usEntityState: string;
  hiresYear1: number;
  hiresYear2: number;
  hiresYear3: number;
  rushProduction: boolean;
  complianceNotes: string;
  signatureName: string;
  agreeToTerms: boolean;
  totalPrice: number;
  depositPrice: number;
  submittedAt: string;
  userAgent: string;
}

function generateOrderId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return `BPG-${ts}-${rand}`.toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitBody;

    // Validate required fields
    const required: (keyof SubmitBody)[] = [
      'attorneyName',
      'firmName',
      'firmEmail',
      'barAdmissionState',
      'investorName',
      'investorCountry',
      'visaCategory',
      'investmentAmount',
      'businessConcept',
      'businessName',
      'industry',
      'usLocation',
      'usState',
      'sourceOfFundsSummary',
      'hiresYear1',
      'hiresYear2',
      'hiresYear3',
      'signatureName',
    ];
    for (const field of required) {
      const v = body[field];
      if (v === undefined || v === null || v === '' || (typeof v === 'number' && Number.isNaN(v))) {
        return NextResponse.json({ error: `Missing required field: ${String(field)}` }, { status: 400 });
      }
    }
    if (!body.agreeToTerms) {
      return NextResponse.json({ error: 'Engagement terms must be agreed to' }, { status: 400 });
    }

    const visaInfo = VISA_PRICING[body.visaCategory];
    if (!visaInfo) {
      return NextResponse.json({ error: `Unknown visa category: ${body.visaCategory}` }, { status: 400 });
    }

    const orderId = generateOrderId();
    const productionDays = body.rushProduction ? 3 : 5;
    const signerIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '(unavailable)';

    // Generate engagement letter
    const engagementBuffer = await generateEngagementLetterDocx({
      orderId,
      attorneyName: body.attorneyName,
      firmName: body.firmName,
      firmEmail: body.firmEmail,
      barAdmissionState: body.barAdmissionState,
      visaCategory: body.visaCategory,
      visaCategoryLabel: visaInfo.label,
      investorName: body.investorName,
      businessName: body.businessName,
      totalPrice: body.totalPrice,
      depositPrice: body.depositPrice,
      rushProduction: body.rushProduction,
      productionDays,
      signatureName: body.signatureName,
      submittedAt: body.submittedAt,
      signerIp,
      userAgent: body.userAgent || '',
    });

    // Create Stripe payment link for the deposit
    let depositPaymentLink = '';
    try {
      const stripe = getStripe();

      // Create a one-time price for this specific deposit
      const product = await stripe.products.create({
        name: `${visaInfo.label} business plan production - deposit (${orderId})`,
        description: `50% deposit for ${body.firmName} - ${body.investorName} ${body.visaCategory} petition. Order ${orderId}.`,
        metadata: {
          orderId,
          firmName: body.firmName,
          visaCategory: body.visaCategory,
          investorName: body.investorName,
          paymentType: 'deposit',
          totalFee: String(body.totalPrice),
        },
      });

      const price = await stripe.prices.create({
        product: product.id,
        currency: 'usd',
        unit_amount: body.depositPrice * 100, // cents
      });

      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        metadata: {
          orderId,
          firmName: body.firmName,
          firmEmail: body.firmEmail,
          visaCategory: body.visaCategory,
          paymentType: 'deposit',
        },
        after_completion: {
          type: 'hosted_confirmation',
          hosted_confirmation: {
            custom_message: `Deposit received for order ${orderId}. Production clock has started. You will receive the white-labeled .docx plan within ${productionDays} business days.`,
          },
        },
      });

      depositPaymentLink = paymentLink.url;
    } catch (stripeErr: unknown) {
      const msg = stripeErr instanceof Error ? stripeErr.message : 'Unknown Stripe error';
      console.error(`[submit-intake] Stripe error for order ${orderId}:`, msg);
      // Continue without payment link; we'll send Adi a manual-invoice trigger
      depositPaymentLink = '';
    }

    // Send engagement email to attorney with engagement letter + Stripe link
    try {
      await sendEngagementEmail({
        to: body.firmEmail,
        attorneyName: body.attorneyName,
        firmName: body.firmName,
        orderId,
        visaCategoryLabel: visaInfo.label,
        investorName: body.investorName,
        depositAmount: body.depositPrice,
        totalAmount: body.totalPrice,
        productionDays,
        depositPaymentLink,
        engagementLetterBuffer: engagementBuffer,
      });
    } catch (emailErr) {
      console.error(`[submit-intake] engagement email failed for ${orderId}:`, emailErr);
    }

    // Notify Adi
    try {
      await sendCounselOrderNotification({
        orderId,
        firmName: body.firmName,
        attorneyName: body.attorneyName,
        firmEmail: body.firmEmail,
        visaCategory: body.visaCategory,
        visaCategoryLabel: visaInfo.label,
        investorName: body.investorName,
        investorCountry: body.investorCountry,
        businessName: body.businessName,
        usLocation: body.usLocation,
        totalPrice: body.totalPrice,
        depositPrice: body.depositPrice,
        rushProduction: body.rushProduction,
        productionDays,
        depositPaymentLink,
        intakeData: body as unknown as Record<string, unknown>,
      });
    } catch (notifyErr) {
      console.error(`[submit-intake] adi notification failed for ${orderId}:`, notifyErr);
    }

    return NextResponse.json({
      ok: true,
      orderId,
      depositPrice: body.depositPrice,
      depositPaymentLink,
      productionDays,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[submit-intake] error:', message);
    return NextResponse.json(
      { error: 'Failed to process intake submission', detail: message },
      { status: 500 },
    );
  }
}
