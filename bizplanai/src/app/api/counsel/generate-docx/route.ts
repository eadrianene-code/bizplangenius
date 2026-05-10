import { NextRequest, NextResponse } from 'next/server';
import { generatePlanDocx } from '@/lib/docx-generator';
import type { Plan, PlanMetadata, DocxOptions } from '@/lib/plan-types';

export const maxDuration = 60;
export const runtime = 'nodejs';

/**
 * Generate a white-labeled .docx file from a plan JSON.
 *
 * Auth: x-api-key header must match B2B_API_KEY env var. This is a temporary
 * gate for v1; replace with a proper session/order auth in P6 when the
 * engagement-letter -> Stripe flow lands.
 *
 * Body:
 *   {
 *     plan: <full plan JSON, same shape as /api/fulfill output>,
 *     meta: { businessName: string, industry?: string, location?: string, tier?: 'starter'|'pro' },
 *     options: { whiteLabel: boolean, preparedForFirm?: string, date?: string, includeUscisOverlay?: boolean }
 *   }
 *
 * Response: 200 with Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 *           binary body.
 */
export async function POST(req: NextRequest) {
  try {
    // Auth: simple API key for v1
    const apiKey = req.headers.get('x-api-key');
    const expected = process.env.B2B_API_KEY;
    if (!expected) {
      console.error('[generate-docx] B2B_API_KEY not configured in env');
      return NextResponse.json(
        { error: 'Server misconfigured: B2B_API_KEY missing' },
        { status: 500 },
      );
    }
    if (!apiKey || apiKey !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const plan = body.plan as Plan | undefined;
    const meta = body.meta as PlanMetadata | undefined;
    const options = body.options as Partial<DocxOptions> | undefined;

    if (!plan || typeof plan !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid `plan` field' }, { status: 400 });
    }
    if (!meta || !meta.businessName) {
      return NextResponse.json(
        { error: 'Missing or invalid `meta.businessName` field' },
        { status: 400 },
      );
    }

    // Default to whiteLabel TRUE on this endpoint (it's the B2B path).
    // Caller must explicitly pass false to get the consumer-branded version.
    const opts: DocxOptions = {
      whiteLabel: options?.whiteLabel !== false,
      preparedForFirm: options?.preparedForFirm,
      date: options?.date,
      includeUscisOverlay: options?.includeUscisOverlay === true,
    };

    const buffer = await generatePlanDocx(plan, meta, opts);

    const safeName = meta.businessName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
    const filename = `${safeName}_business_plan.docx`;

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
    console.error('[generate-docx] error:', message);
    return NextResponse.json(
      { error: 'Failed to generate document', detail: message },
      { status: 500 },
    );
  }
}
