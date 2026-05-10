/**
 * Server-side .docx generator for BizPlan Genius plans.
 *
 * Used by:
 * - /api/counsel/generate-docx (B2B white-label deliveries, no overlay)
 * - /api/counsel/generate-uscis-plan (B2B with USCIS overlay - the moat)
 * - Future: consumer-side download
 *
 * IMPORTANT: When opts.whiteLabel === true, this function MUST NOT emit any
 * string identifying BizPlan Genius. The white-label test in
 * scripts/generate-test-docx.mjs verifies this. Do not weaken the test.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Header,
  Footer,
  PageNumber,
  LevelFormat,
} from 'docx';
import type {
  Plan,
  PlanMetadata,
  DocxOptions,
  Competitor,
  MarketingChannel,
  YearProjection,
  Risk,
  KeyMilestone,
  StartupCost,
} from './plan-types';
import { renderMarkdownToDocx } from './markdown-to-docx';
import type { OverlaySections } from './uscis-overlay';

// ============================================================================
// Helpers
// ============================================================================

function safe(s: string | undefined | null): string {
  return (s || '').trim();
}

function nonEmpty(s: string | undefined | null): boolean {
  return !!s && s.trim().length > 0;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function h1(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 240 },
    pageBreakBefore: true,
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 180 },
  });
}

function h3(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
  });
}

function p(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    spacing: { after: 160, line: 320 },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    bullet: { level: 0 },
    spacing: { after: 80, line: 300 },
  });
}

function emptyLine(): Paragraph {
  return new Paragraph({ text: '' });
}

function makeTableHeader(headers: string[]): TableRow {
  return new TableRow({
    tableHeader: true,
    children: headers.map(
      (h) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 20 })],
            }),
          ],
          width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
        }),
    ),
  });
}

function makeTableRow(cells: string[]): TableRow {
  return new TableRow({
    children: cells.map(
      (c) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: c, size: 20 })],
            }),
          ],
          width: { size: 100 / cells.length, type: WidthType.PERCENTAGE },
        }),
    ),
  });
}

// ============================================================================
// Cover page
// ============================================================================

function buildCoverPage(meta: PlanMetadata, opts: DocxOptions): Paragraph[] {
  const date = opts.date || todayIso();
  const businessName = meta.businessName || 'Business Plan';

  if (opts.whiteLabel) {
    const out: Paragraph[] = [
      ...Array.from({ length: 8 }, () => emptyLine()),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [
          new TextRun({
            text: businessName,
            bold: true,
            size: 56,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [
          new TextRun({
            text: 'Business Plan',
            size: 36,
          }),
        ],
      }),
    ];

    if (opts.preparedForFirm) {
      out.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: `Prepared for ${opts.preparedForFirm}`,
              size: 24,
              italics: true,
            }),
          ],
        }),
      );
    }

    out.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({ text: date, size: 22 })],
      }),
      new Paragraph({ children: [new PageBreak()] }),
    );

    return out;
  }

  return [
    ...Array.from({ length: 6 }, () => emptyLine()),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text: businessName,
          bold: true,
          size: 56,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: 'Business Plan',
          size: 36,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: meta.industry ? `${meta.industry} | ${date}` : date,
          size: 22,
          color: '6B7280',
        }),
      ],
    }),
    ...Array.from({ length: 4 }, () => emptyLine()),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'CONFIDENTIAL',
          bold: true,
          size: 20,
          color: '991B1B',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'Prepared with BizPlan Genius - bizplangenius.com',
          size: 18,
          color: '6B7280',
          italics: true,
        }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ============================================================================
// Section builders (consumer plan)
// ============================================================================

function buildExecutiveSummary(plan: Plan): Paragraph[] {
  const es = plan.executiveSummary;
  if (!es) return [];
  const out: Paragraph[] = [h1('Executive Summary')];

  if (nonEmpty(es.overview)) {
    out.push(h2('Overview'), p(safe(es.overview)));
  }
  if (nonEmpty(es.mission)) {
    out.push(h2('Mission'), p(safe(es.mission)));
  }
  if (nonEmpty(es.vision)) {
    out.push(h2('Vision'), p(safe(es.vision)));
  }
  if (nonEmpty(es.valueProposition)) {
    out.push(h2('Value Proposition'), p(safe(es.valueProposition)));
  }
  if (es.keyMetrics && es.keyMetrics.length > 0) {
    out.push(h2('Key Projected Metrics'));
    es.keyMetrics.forEach((m) => out.push(bullet(m)));
  }
  return out;
}

function buildCompetitorAnalysis(plan: Plan): Paragraph[] {
  const ca = plan.competitorAnalysis;
  if (!ca) return [];
  const out: Paragraph[] = [h1('Competitor Analysis')];

  if (nonEmpty(ca.overview)) {
    out.push(p(safe(ca.overview)));
  }

  if (ca.competitors && ca.competitors.length > 0) {
    out.push(h2('Competitor Profiles'));
    ca.competitors.forEach((c: Competitor) => {
      out.push(h3(safe(c.name) || 'Unnamed Competitor'));
      if (nonEmpty(c.description)) out.push(p(safe(c.description)));
      if (nonEmpty(c.estimatedRevenue)) out.push(p(`Estimated revenue: ${safe(c.estimatedRevenue)}`));
      if (nonEmpty(c.pricing)) out.push(p(`Pricing: ${safe(c.pricing)}`));

      if (c.strengths && c.strengths.length > 0) {
        out.push(p('Strengths:'));
        c.strengths.forEach((s) => out.push(bullet(s)));
      }
      if (c.weaknesses && c.weaknesses.length > 0) {
        out.push(p('Weaknesses:'));
        c.weaknesses.forEach((w) => out.push(bullet(w)));
      }
    });
  }

  if (nonEmpty(ca.competitiveAdvantage)) {
    out.push(h2('Our Competitive Advantage'), p(safe(ca.competitiveAdvantage)));
  }

  if (ca.marketGaps && ca.marketGaps.length > 0) {
    out.push(h2('Market Gaps to Exploit'));
    ca.marketGaps.forEach((g) => out.push(bullet(g)));
  }

  return out;
}

function buildMarketAnalysis(plan: Plan): Paragraph[] {
  const ma = plan.marketAnalysis;
  if (!ma) return [];
  const out: Paragraph[] = [h1('Market Analysis')];

  if (nonEmpty(ma.industryOverview)) out.push(h2('Industry Overview'), p(safe(ma.industryOverview)));
  if (nonEmpty(ma.marketSize)) out.push(h2('Market Size'), p(safe(ma.marketSize)));
  if (nonEmpty(ma.growthRate)) out.push(h2('Growth Rate'), p(safe(ma.growthRate)));

  if (ma.trends && ma.trends.length > 0) {
    out.push(h2('Industry Trends'));
    ma.trends.forEach((t) => out.push(bullet(t)));
  }

  if (ma.targetCustomerProfile) {
    const tcp = ma.targetCustomerProfile;
    out.push(h2('Target Customer Profile'));
    if (nonEmpty(tcp.demographics)) out.push(h3('Demographics'), p(safe(tcp.demographics)));
    if (nonEmpty(tcp.psychographics)) out.push(h3('Psychographics'), p(safe(tcp.psychographics)));
    if (tcp.painPoints && tcp.painPoints.length > 0) {
      out.push(h3('Pain Points'));
      tcp.painPoints.forEach((pp) => out.push(bullet(pp)));
    }
    if (nonEmpty(tcp.buyingBehavior)) out.push(h3('Buying Behavior'), p(safe(tcp.buyingBehavior)));
  }

  return out;
}

function buildMarketingStrategy(plan: Plan): (Paragraph | Table)[] {
  const ms = plan.marketingStrategy;
  if (!ms) return [];
  const out: (Paragraph | Table)[] = [h1('Marketing Strategy')];

  if (nonEmpty(ms.positioning)) out.push(h2('Positioning'), p(safe(ms.positioning)));

  if (ms.channels && ms.channels.length > 0) {
    out.push(h2('Marketing Channels'));
    const rows: TableRow[] = [makeTableHeader(['Channel', 'Strategy', 'Estimated CAC', 'Priority'])];
    ms.channels.forEach((c: MarketingChannel) => {
      rows.push(
        makeTableRow([
          safe(c.channel),
          safe(c.strategy),
          safe(c.estimatedCAC),
          safe(c.priority),
        ]),
      );
    });
    out.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  }

  if (nonEmpty(ms.contentStrategy)) out.push(h2('Content Strategy'), p(safe(ms.contentStrategy)));
  if (nonEmpty(ms.launchPlan)) out.push(h2('First 90 Days: Launch Plan'), p(safe(ms.launchPlan)));

  return out;
}

function buildFinancialProjections(plan: Plan): (Paragraph | Table)[] {
  const fp = plan.financialProjections;
  if (!fp) return [];
  const out: (Paragraph | Table)[] = [h1('Financial Projections')];

  if (nonEmpty(fp.revenueModel)) out.push(h2('Revenue Model'), p(safe(fp.revenueModel)));

  const years: { label: string; data: YearProjection | undefined }[] = [
    { label: 'Year 1', data: fp.year1 },
    { label: 'Year 2', data: fp.year2 },
    { label: 'Year 3', data: fp.year3 },
    { label: 'Year 4', data: fp.year4 },
    { label: 'Year 5', data: fp.year5 },
  ].filter((y) => y.data);

  if (years.length > 0) {
    out.push(h2('Annual Projections'));
    const rows: TableRow[] = [makeTableHeader(['Year', 'Revenue', 'Costs', 'Profit', 'Customers'])];
    years.forEach((y) => {
      rows.push(
        makeTableRow([
          y.label,
          safe(y.data?.revenue),
          safe(y.data?.costs),
          safe(y.data?.profit),
          safe(y.data?.customers),
        ]),
      );
    });
    out.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  }

  if (fp.keyAssumptions && fp.keyAssumptions.length > 0) {
    out.push(h2('Key Assumptions'));
    fp.keyAssumptions.forEach((a) => out.push(bullet(a)));
  }

  if (nonEmpty(fp.breakEvenTimeline)) {
    out.push(h2('Break-Even Timeline'), p(safe(fp.breakEvenTimeline)));
  }

  if (fp.startupCosts && fp.startupCosts.length > 0) {
    out.push(h2('Startup Costs'));
    const rows: TableRow[] = [makeTableHeader(['Item', 'Amount'])];
    fp.startupCosts.forEach((sc: StartupCost) => {
      rows.push(makeTableRow([safe(sc.item), safe(sc.amount)]));
    });
    out.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  }

  return out;
}

function buildOperationsPlan(plan: Plan): Paragraph[] {
  const op = plan.operationsPlan;
  if (!op) return [];
  const out: Paragraph[] = [h1('Operations Plan')];

  if (nonEmpty(op.businessModel)) out.push(h2('Business Model'), p(safe(op.businessModel)));
  if (nonEmpty(op.teamStructure)) out.push(h2('Team Structure'), p(safe(op.teamStructure)));
  if (nonEmpty(op.technology)) out.push(h2('Technology'), p(safe(op.technology)));

  if (op.keyMilestones && op.keyMilestones.length > 0) {
    out.push(h2('Key Milestones'));
    op.keyMilestones.forEach((km: KeyMilestone) => {
      out.push(bullet(`${safe(km.timeline)}: ${safe(km.milestone)}`));
    });
  }

  return out;
}

function buildRiskAnalysis(plan: Plan): (Paragraph | Table)[] {
  const ra = plan.riskAnalysis;
  if (!ra || !ra.risks || ra.risks.length === 0) return [];
  const out: (Paragraph | Table)[] = [h1('Risk Analysis')];

  const rows: TableRow[] = [makeTableHeader(['Risk', 'Likelihood', 'Impact', 'Mitigation'])];
  ra.risks.forEach((r: Risk) => {
    rows.push(
      makeTableRow([
        safe(r.risk),
        safe(r.likelihood),
        safe(r.impact),
        safe(r.mitigation),
      ]),
    );
  });
  out.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));

  return out;
}

// ============================================================================
// Headers and footers
// ============================================================================

function buildConsumerHeader(meta: PlanMetadata): Header {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `${meta.businessName} - Business Plan`,
            size: 18,
            color: '6B7280',
          }),
        ],
      }),
    ],
  });
}

function buildConsumerFooter(): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'Prepared with BizPlan Genius - bizplangenius.com - Page ',
            size: 16,
            color: '9CA3AF',
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 16,
            color: '9CA3AF',
          }),
        ],
      }),
    ],
  });
}

function buildWhiteLabelFooter(): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 16,
            color: '9CA3AF',
          }),
        ],
      }),
    ],
  });
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Build a .docx file from a plan JSON object.
 *
 * @param plan The structured plan JSON.
 * @param meta Business metadata.
 * @param opts Generation options including whiteLabel flag.
 * @param overlay Optional USCIS overlay sections. When provided, the document
 *   is reorganized for a B2B counsel deliverable.
 * @returns A Node Buffer containing the .docx binary.
 */
export async function generatePlanDocx(
  plan: Plan,
  meta: PlanMetadata,
  opts: DocxOptions,
  overlay?: OverlaySections,
): Promise<Buffer> {
  let sections: (Paragraph | Table)[];

  if (overlay) {
    // B2B counsel order: USCIS-structured. Order matters - this is what an
    // adjudicator expects.
    sections = [
      ...buildCoverPage(meta, opts),
      // 1. Adjudicator Summary (front matter)
      ...renderMarkdownToDocx(overlay.adjudicatorSummary),
      // 2. Investor Background
      ...renderMarkdownToDocx(overlay.investorBackground),
      // 3. Source of Funds
      ...renderMarkdownToDocx(overlay.sourceOfFunds),
      // 4. Visa-Specific Eligibility
      ...renderMarkdownToDocx(overlay.visaEligibility),
      // 5. Executive Summary (consumer narrative)
      ...buildExecutiveSummary(plan),
      // 6. Market context (consumer narrative)
      ...buildCompetitorAnalysis(plan),
      ...buildMarketAnalysis(plan),
      ...buildMarketingStrategy(plan),
      // 7. Expanded Financial Model (REPLACES consumer financialProjections)
      ...renderMarkdownToDocx(overlay.expandedFinancialModel),
      // 8. US Hiring Plan and Job Creation
      ...renderMarkdownToDocx(overlay.usHiringPlan),
      // 9. Operations Plan - Expanded (REPLACES consumer operationsPlan)
      ...renderMarkdownToDocx(overlay.expandedOperations),
      // 10. Risk Analysis - USCIS-targeted (REPLACES consumer riskAnalysis)
      ...renderMarkdownToDocx(overlay.uscisRiskAnalysis),
    ];
  } else {
    // Consumer order: original 9-section plan
    sections = [
      ...buildCoverPage(meta, opts),
      ...buildExecutiveSummary(plan),
      ...buildCompetitorAnalysis(plan),
      ...buildMarketAnalysis(plan),
      ...buildMarketingStrategy(plan),
      ...buildFinancialProjections(plan),
      ...buildOperationsPlan(plan),
      ...buildRiskAnalysis(plan),
    ];
  }

  const doc = new Document({
    creator: opts.whiteLabel ? meta.businessName : 'BizPlan Genius',
    title: `${meta.businessName} Business Plan`,
    description: opts.whiteLabel
      ? `Business plan for ${meta.businessName}`
      : `Business plan for ${meta.businessName} prepared with BizPlan Genius`,
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
          },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: 'bullet-list',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080,
              right: 1080,
              bottom: 1080,
              left: 1080,
            },
          },
        },
        headers: opts.whiteLabel ? undefined : { default: buildConsumerHeader(meta) },
        footers: { default: opts.whiteLabel ? buildWhiteLabelFooter() : buildConsumerFooter() },
        children: sections,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
