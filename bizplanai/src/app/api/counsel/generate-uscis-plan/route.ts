import { NextRequest, NextResponse } from 'next/server';
import { generatePlanDocx } from '@/lib/docx-generator';
import { generateUscisOverlay } from '@/lib/uscis-overlay';
import type { IntakeForm } from '@/lib/uscis-overlay';
import type { Plan, PlanMetadata, DocxOptions } from '@/lib/plan-types';

export const maxDuration = 60;
export const runtime = 'nodejs';

/**
 * Generate a USCIS-structured business plan as a white-labeled .docx.
 *
 * This is THE B2B endpoint - what justifies the $1,500-$2,500 lawyer price.
 *
 * Flow:
 *   1. Auth via x-api-key header (B2B_API_KEY env var)
 *   2. Receive intake form + base plan JSON in body
 *   3. Run generateUscisOverlay() to produce 8 USCIS-targeted sections
 *   4. Run generatePlanDocx() with overlay -> reorders document for adjudicators
 *   5. Returns binary .docx download (white-labeled by default)
 *
 * Body:
 *   {
 *     intake: <IntakeForm>,
 *     plan: <Plan>,
 *     options?: { whiteLabel?: boolean (default true), preparedForFirm?: string, date?: string }
 *   }
 *
 * The base plan JSON should come from the existing /api/fulfill output. In
 * production the engagement-letter -> Stripe deposit -> production flow will
 * generate the base plan automatically using intake data, then call this
 * endpoint to produce the USCIS-structured deliverable. For v1 (this commit),
 * the caller passes both pieces.
 *
 * v1: E-2 only. Other visa categories return 400 with a clear error.
 */
export async function POST(req: NextRequest) {
  try {
    // Auth: accept either the primary B2B_API_KEY (production) or the
    // B2B_API_KEY_SAMPLE_GEN (temporary, used by Claude to generate sample
    // plans before removal). Both are valid.
    const apiKey = req.headers.get('x-api-key');
    const expectedPrimary = process.env.B2B_API_KEY;
    const expectedSample = process.env.B2B_API_KEY_SAMPLE_GEN;
    if (!expectedPrimary && !expectedSample) {
      console.error('[generate-uscis-plan] no API key configured');
      return NextResponse.json(
        { error: 'Server misconfigured: B2B_API_KEY missing' },
        { status: 500 },
      );
    }
    if (!apiKey || (apiKey !== expectedPrimary && apiKey !== expectedSample)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const intake = body.intake as IntakeForm | undefined;
    const plan = body.plan as Plan | undefined;
    const options = body.options as Partial<DocxOptions> | undefined;

    if (!intake || typeof intake !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid `intake` field' },
        { status: 400 },
      );
    }
    if (!plan || typeof plan !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid `plan` field' },
        { status: 400 },
      );
    }

    // Required intake fields
    const required: (keyof IntakeForm)[] = [
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
    ];
    for (const field of required) {
      if (intake[field] === undefined || intake[field] === null || intake[field] === '') {
        return NextResponse.json(
          { error: `Missing required intake field: ${String(field)}` },
          { status: 400 },
        );
      }
    }

    // v1.2: E-2, L-1, EB-5 supported (O-1 and EB-2 NIW pending)
    const supportedVisas = ['E-2', 'L-1', 'EB-5'];
    if (!supportedVisas.includes(intake.visaCategory)) {
      return NextResponse.json(
        {
          error: `USCIS plan generation supports E-2, L-1, EB-5 in v1.2. Visa category "${intake.visaCategory}" templates are pending.`,
        },
        { status: 400 },
      );
    }

    // Generate the overlay (8 USCIS sections, filled markdown)
    const overlay = generateUscisOverlay(plan, intake);

    // Build docx with overlay
    const meta: PlanMetadata = {
      businessName: intake.businessName,
      industry: intake.industry,
      location: intake.usLocation,
      tier: 'pro',
    };
    const opts: DocxOptions = {
      whiteLabel: options?.whiteLabel !== false, // default true
      preparedForFirm: options?.preparedForFirm,
      date: options?.date,
      includeUscisOverlay: true,
    };

    const buffer = await generatePlanDocx(plan, meta, opts, overlay);

    const safeName = intake.businessName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
    const filename = `${safeName}_${intake.visaCategory}_business_plan.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[generate-uscis-plan] error:', message);
    return NextResponse.json(
      { error: 'Failed to generate USCIS plan', detail: message },
      { status: 500 },
    );
  }
}
