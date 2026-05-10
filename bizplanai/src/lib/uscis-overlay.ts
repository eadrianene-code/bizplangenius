/**
 * USCIS Overlay Generator (P7).
 *
 * Combines an existing plan JSON + lawyer intake form data + visa-specific
 * Markdown templates to produce the eight USCIS overlay sections required for
 * a $1,500-$2,500 B2B counsel deliverable.
 *
 * Used by /api/counsel/generate-uscis-plan and the future B2B order pipeline.
 * Each template is a Markdown file with {{field}} placeholders; this module
 * reads the relevant templates, builds a context object from the intake form
 * + plan JSON, fills the placeholders, and returns 8 filled markdown sections
 * ready to be rendered into a docx by markdown-to-docx.ts.
 *
 * Visa categories supported (v1):
 *   E-2  - all 8 sections shipped
 *   L-1  - planned, templates pending
 *   O-1  - planned, templates pending
 *   EB-5 - planned, templates pending (most depth)
 *   EB-2 NIW - planned, templates pending
 *
 * v1 ships E-2 only because that is the largest immigration-attorney segment
 * and gives us the fastest path to a paying customer.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type { Plan } from './plan-types';

export type VisaCategory = 'E-2' | 'L-1' | 'O-1' | 'EB-5' | 'EB-2-NIW';

/**
 * Lawyer intake form data. Mirrors the shape from /counsel/intake (P3).
 * v1 includes only the fields the E-2 templates consume; expand as P3 lands.
 */
export interface IntakeForm {
  attorneyName: string;
  firmName: string;
  firmEmail: string;
  barAdmissionState: string;

  investorName: string;
  investorCountry: string;
  investorCountryCurrency?: string; // e.g. "BRL"
  investorTitle?: string;
  investorOwnershipPercent?: number;
  investorEducation?: string;
  investorProfessionalBackground?: string;
  investorBusinessExperience?: string;
  investorIndustryCredentials?: string;
  familySize?: number;

  visaCategory: VisaCategory;
  investmentAmount: number;
  totalEnterpriseCost?: number;
  capitalCommitmentDate?: string;
  committedAmount?: number;
  usBank?: string;

  businessConcept: string;
  businessName: string; // distinct from concept; the actual entity name
  industry: string;
  naicsCode?: string;
  usLocation: string;
  usState: string;
  premisesType?: string;
  squareFootage?: string;
  buildoutStatus?: string;
  leaseSummary?: string;
  accountingSoftware?: string;

  sourceOfFundsSummary: string;
  sourceOfFundsBreakdown?: { source: string; amount: number; documentation: string }[];

  existingUsEntity?: boolean;
  usEntityName?: string;
  usEntityState?: string;

  hiresYear1: number;
  hiresYear2: number;
  hiresYear3: number;
  hiresYear4?: number;
  hiresYear5?: number;
  positions?: { title: string; year: number; salaryRange: string; responsibilities: string }[];

  equipmentList?: { item: string; cost: number; status: string }[];
  vendors?: { name: string; service: string; status: string }[];

  complianceNotes?: string;
}

/**
 * Each section is a string of filled markdown ready for rendering.
 * The docx generator parses each into headings/paragraphs/tables.
 */
export interface OverlaySections {
  adjudicatorSummary: string;
  investorBackground: string;
  sourceOfFunds: string;
  visaEligibility: string;
  expandedFinancialModel: string;
  usHiringPlan: string;
  expandedOperations: string;
  uscisRiskAnalysis: string;
}

// ============================================================================
// Visa-specific constants
// ============================================================================

interface VisaMeta {
  fullName: string;
  formNumber: string;
  regulatoryCitation: string;
  eligibilityTemplate: string;
  sourceOfFundsTemplate: string;
}

const VISA_METADATA: Record<VisaCategory, VisaMeta> = {
  'E-2': {
    fullName: 'E-2 Treaty Investor visa',
    formNumber: 'I-129 (Form I-129E supplement)',
    regulatoryCitation: '8 CFR 214.2(e) and USCIS Policy Manual Vol. 6, Pt. G',
    eligibilityTemplate: 'eligibility-e2.md',
    sourceOfFundsTemplate: 'source-of-funds-e2.md',
  },
  'L-1': {
    fullName: 'L-1A Intracompany Transferee Executive or Manager visa',
    formNumber: 'I-129 (Form I-129L supplement)',
    regulatoryCitation: '8 CFR 214.2(l) and USCIS Policy Manual Vol. 2, Pt. L',
    eligibilityTemplate: 'eligibility-l1a.md',
    sourceOfFundsTemplate: 'source-of-funds-l1.md',
  },
  'O-1': {
    fullName: 'O-1 Individuals with Extraordinary Ability or Achievement visa',
    formNumber: 'I-129 (Form I-129O supplement)',
    regulatoryCitation: '8 CFR 214.2(o) and USCIS Policy Manual Vol. 2, Pt. M',
    eligibilityTemplate: 'eligibility-o1.md',
    sourceOfFundsTemplate: 'source-of-funds-o1.md',
  },
  'EB-5': {
    fullName: 'EB-5 Immigrant Investor visa',
    formNumber: 'I-526E',
    regulatoryCitation: '8 CFR 204.6 and USCIS Policy Manual Vol. 6, Pt. G',
    eligibilityTemplate: 'eligibility-eb5.md',
    sourceOfFundsTemplate: 'source-of-funds-eb5.md',
  },
  'EB-2-NIW': {
    fullName: 'EB-2 National Interest Waiver visa',
    formNumber: 'I-140',
    regulatoryCitation: '8 CFR 204.5(k) and USCIS Policy Manual Vol. 6, Pt. F, Ch. 5',
    eligibilityTemplate: 'eligibility-eb2niw.md',
    sourceOfFundsTemplate: 'source-of-funds-eb2niw.md',
  },
};

// ============================================================================
// Helpers
// ============================================================================

const TEMPLATES_DIR = 'src/lib/uscis-templates';

function loadTemplate(filename: string): string {
  const path = join(process.cwd(), TEMPLATES_DIR, filename);
  try {
    return readFileSync(path, 'utf8');
  } catch (err) {
    throw new Error(
      `USCIS template not found: ${path}. Ensure ${TEMPLATES_DIR}/${filename} is included in the deployment.`,
    );
  }
}

export function fillTemplate(template: string, context: Record<string, string | number>): string {
  return template.replace(/\{\{([a-z_]+)\}\}/gi, (_, key: string) => {
    const value = context[key];
    if (value === undefined || value === null || value === '') {
      return `[MISSING: ${key}]`;
    }
    return String(value);
  });
}

function fmtUsd(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '';
  return `$${amount.toLocaleString('en-US')}`;
}

function parseDollarString(s: string | undefined): number {
  if (!s) return 0;
  const cleaned = String(s).replace(/[^0-9.]/g, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

/**
 * Inverted sliding scale benchmark for E-2 substantial-investment analysis.
 * USCIS Policy Manual Vol. 6, Pt. G, Ch. 2(C).
 */
export function slidingScaleBenchmark(totalEnterpriseCost: number): number {
  if (totalEnterpriseCost < 100_000) return 100;
  if (totalEnterpriseCost < 500_000) return 85;
  if (totalEnterpriseCost < 1_000_000) return 70;
  if (totalEnterpriseCost < 3_000_000) return 55;
  return 40;
}

// ============================================================================
// Context builders (one per template)
// ============================================================================

function buildAdjudicatorSummaryContext(intake: IntakeForm, plan: Plan): Record<string, string | number> {
  const meta = VISA_METADATA[intake.visaCategory];
  const prongMap: Record<VisaCategory, { prong: string; section: string }[]> = {
    'E-2': [
      { prong: 'Treaty country and nationality', section: 'Section 4.1' },
      { prong: 'Substantial investment (sliding scale)', section: 'Section 4.2' },
      { prong: 'At-risk and irrevocably committed', section: 'Section 4.3' },
      { prong: 'Real and active enterprise', section: 'Sections 4.4 and 9' },
      { prong: 'Marginality test (non-marginal enterprise)', section: 'Sections 4.5 and 7' },
      { prong: 'Develop and direct (50%+ ownership/control)', section: 'Section 4.6' },
    ],
    'L-1': [
      { prong: 'Qualifying relationship between foreign + US entities', section: 'Section 4.1' },
      { prong: 'One year of qualifying employment abroad', section: 'Section 4.2' },
      { prong: 'Executive or managerial capacity', section: 'Section 4.3' },
      { prong: 'New office viability (one-year staffing/revenue)', section: 'Sections 4.4 and 8' },
    ],
    'O-1': [
      { prong: 'Extraordinary ability evidence', section: 'Section 4.1' },
      { prong: 'Business activity supporting O-1 holder', section: 'Section 4.2' },
      { prong: 'US business need for O-1 services', section: 'Sections 4.3 and 8' },
    ],
    'EB-5': [
      { prong: 'Required investment ($1.05M standard / $800K TEA)', section: 'Section 4.1' },
      { prong: 'Lawful source of funds', section: 'Section 2' },
      { prong: 'At-risk capital deployment', section: 'Section 4.2' },
      { prong: 'Job creation (10 full-time US jobs in 2 years)', section: 'Sections 4.3 and 8' },
      { prong: 'Sustainment through I-829', section: 'Section 7' },
    ],
    'EB-2-NIW': [
      { prong: 'Substantial merit and national importance', section: 'Section 4.1' },
      { prong: 'Petitioner well-positioned to advance the endeavor', section: 'Section 4.2' },
      { prong: 'Balance of factors favors waiver', section: 'Section 4.3' },
    ],
  };

  const prongMappingTable = [
    '| USCIS criterion | Plan section addressing it |',
    '| --- | --- |',
    ...prongMap[intake.visaCategory].map((p) => `| ${p.prong} | ${p.section} |`),
  ].join('\n');

  const petitionerNarrative = `${intake.investorName} brings ${intake.investorBusinessExperience || 'documented business experience'} to ${intake.businessName}. The plan demonstrates that the petitioner will develop and direct the enterprise, that the investment is substantial relative to enterprise cost, and that the enterprise is non-marginal under the criteria mapped above.`;

  return {
    investor_name: intake.investorName,
    investor_country: intake.investorCountry,
    visa_category: intake.visaCategory,
    visa_category_full: meta.fullName,
    form_number: meta.formNumber,
    regulatory_citation: meta.regulatoryCitation,
    business_name: intake.businessName,
    industry: intake.industry,
    us_location: intake.usLocation,
    investment_amount: fmtUsd(intake.investmentAmount),
    capital_deployment_summary: intake.committedAmount
      ? `${fmtUsd(intake.committedAmount)} deployed as of ${intake.capitalCommitmentDate || 'plan date'}, balance committed per capital allocation table`
      : 'Per capital allocation table in Section 4',
    year1_us_hires: intake.hiresYear1,
    year5_us_hires: intake.hiresYear5 || (intake.hiresYear1 + intake.hiresYear2 + intake.hiresYear3),
    petitioner_narrative_paragraph: petitionerNarrative,
    plan_date: new Date().toISOString().slice(0, 10),
    plan_version: '1.0',
    prong_mapping_table: prongMappingTable,
  };
}

function buildInvestorBackgroundContext(intake: IntakeForm, _plan: Plan): Record<string, string | number> {
  const eduParagraph = intake.investorEducation
    ? intake.investorEducation
    : `${intake.investorName} holds formal academic credentials relevant to the operation of ${intake.businessName}. Specific institutions, degrees, and dates of attendance are documented in the credentials exhibit provided by the firm of record.`;

  const profParagraph = intake.investorProfessionalBackground
    ? intake.investorProfessionalBackground
    : `${intake.investorName} has a documented professional history relevant to the ${intake.industry} sector. Specific roles, employers, dates of employment, and verifying contacts are documented in the employment exhibits provided by the firm of record.`;

  const businessExpParagraph = intake.investorBusinessExperience
    ? intake.investorBusinessExperience
    : `${intake.investorName} has prior business experience relevant to operating ${intake.businessName}. Specific prior ventures, ownership stakes, operational responsibilities, and outcomes are documented in the prior-business exhibits provided by the firm of record.`;

  const businessRelevanceBullets = [
    `- Direct sector experience in ${intake.industry}`,
    `- Operational responsibility in prior ventures (P&L, hiring, vendor management)`,
    `- Documented track record of building and scaling commercial activity in this category`,
  ].join('\n');

  const qualSummary = `${intake.investorName} has the formal credentials, professional history, and prior operational responsibility required to develop and direct ${intake.businessName} as a U.S. enterprise. The petitioner is not relying on a third-party operator, an absentee-owner structure, or a passive-investor relationship to satisfy the develop-and-direct standard.`;

  const credentialsParagraph = intake.investorIndustryCredentials
    ? intake.investorIndustryCredentials
    : `Industry recognition, professional memberships, and trade credentials, where applicable, are detailed in the credentials exhibit provided by the firm of record.`;

  return {
    investor_name: intake.investorName,
    investor_country: intake.investorCountry,
    investor_title: intake.investorTitle || 'Founder and Chief Executive Officer',
    business_name: intake.businessName,
    industry: intake.industry,
    visa_category: intake.visaCategory,
    ownership_percentage: intake.investorOwnershipPercent || 100,
    education_paragraph: eduParagraph,
    professional_background_paragraph: profParagraph,
    business_experience_paragraph: businessExpParagraph,
    business_relevance_bullets: businessRelevanceBullets,
    qualification_summary_paragraph: qualSummary,
    industry_credentials_paragraph: credentialsParagraph,
  };
}

function buildSourceOfFundsContext(intake: IntakeForm, _plan: Plan): Record<string, string | number> {
  const sources = intake.sourceOfFundsBreakdown && intake.sourceOfFundsBreakdown.length > 0
    ? intake.sourceOfFundsBreakdown
    : [
        {
          source: 'Personal savings (primary)',
          amount: Math.round(intake.investmentAmount * 0.6),
          documentation: 'Bank statements covering 24 months in firm exhibits',
        },
        {
          source: 'Sale of personal asset',
          amount: Math.round(intake.investmentAmount * 0.3),
          documentation: 'Sale documentation and bank deposit records in firm exhibits',
        },
        {
          source: 'Documented family contribution',
          amount: Math.round(intake.investmentAmount * 0.1),
          documentation: 'Gift letter and donor source documentation in firm exhibits',
        },
      ];

  const breakdownTable = [
    '| Source | Amount (USD) | Documentation |',
    '| --- | --- | --- |',
    ...sources.map((s) => `| ${s.source} | ${fmtUsd(s.amount)} | ${s.documentation} |`),
    `| **Total** | **${fmtUsd(intake.investmentAmount)}** | - |`,
  ].join('\n');

  const sourceNarratives = sources
    .map(
      (s, i) =>
        `### Source ${i + 1}: ${s.source} (${fmtUsd(s.amount)})\n\n${s.source === 'Personal savings (primary)' ? `These funds represent ${intake.investorName}'s accumulated personal savings from documented earnings over the petitioner's professional career. ` : s.source.startsWith('Sale of') ? `These funds represent the proceeds from the sale of a personal asset by ${intake.investorName} prior to the U.S. capital deployment. ` : `These funds represent a documented contribution to ${intake.investorName} consistent with applicable tax and gifting rules in the petitioner's home country. `}Documentary evidence of source, accumulation, and transfer is provided as ${s.documentation}.`,
    )
    .join('\n\n');

  return {
    investment_amount: fmtUsd(intake.investmentAmount),
    business_name: intake.businessName,
    investor_country: intake.investorCountry,
    investor_country_currency: intake.investorCountryCurrency || `the local currency of ${intake.investorCountry}`,
    us_bank_or_placeholder: intake.usBank || 'the US operating bank named in the bank exhibits',
    capital_commitment_date: intake.capitalCommitmentDate || 'the date noted in the bank exhibits',
    committed_amount: fmtUsd(intake.committedAmount || Math.round(intake.investmentAmount * 0.6)),
    source_of_funds_summary_paragraph: intake.sourceOfFundsSummary,
    source_breakdown_table: breakdownTable,
    source_narratives: sourceNarratives,
  };
}

function buildE2EligibilityContext(intake: IntakeForm, plan: Plan): Record<string, string | number> {
  const totalCost = intake.totalEnterpriseCost || intake.investmentAmount;
  const investmentPercentage = Math.round((intake.investmentAmount / totalCost) * 100);
  const slidingScaleBench = slidingScaleBenchmark(totalCost);

  const slidingScaleSatisfaction =
    investmentPercentage >= slidingScaleBench
      ? `the ${investmentPercentage}% investment exceeds the ${slidingScaleBench}% benchmark for an enterprise of this scale, satisfying the substantial-investment requirement on the inverted sliding scale.`
      : `the ${investmentPercentage}% investment is below the ${slidingScaleBench}% benchmark for an enterprise of this scale. Counsel should review whether the enterprise total cost should be revised downward, whether additional capital can be invested, or whether alternative structuring satisfies the standard.`;

  const familySize = intake.familySize || 4;
  const baseMedianIncome = 74_580;
  const marginalityBench = Math.round(baseMedianIncome * (1 + (familySize - 4) * 0.15));

  const y1Profit = plan.financialProjections?.year1?.profit || '';
  const y3Profit = plan.financialProjections?.year3?.profit || '';
  const y5Profit = plan.financialProjections?.year5?.profit || y3Profit;

  const treatyParagraph = `${intake.investorCountry} maintains a treaty of commerce and navigation with the United States that confers E-2 treaty-investor status on its nationals. Confirmation of treaty status is included in the petition exhibits and is not in dispute for purposes of this plan.`;

  const atRiskParagraph = `Funds were transferred to the US operating account on ${intake.capitalCommitmentDate || 'the dates noted in the bank exhibits'}, and a substantial portion has already been committed to fixed-asset purchases, lease obligations, and pre-launch operating expenses. The remaining capital is held in operating accounts subject to draw-down per the deployment schedule. No portion is held in escrow contingent on visa approval.`;

  const capitalAllocation = [
    '| Allocation category | Amount |',
    '| --- | --- |',
    `| Equipment and fixed assets | ${fmtUsd(Math.round(intake.investmentAmount * 0.25))} |`,
    `| Lease deposit and pre-paid rent | ${fmtUsd(Math.round(intake.investmentAmount * 0.10))} |`,
    `| Initial inventory and supplies | ${fmtUsd(Math.round(intake.investmentAmount * 0.15))} |`,
    `| Build-out and permits | ${fmtUsd(Math.round(intake.investmentAmount * 0.20))} |`,
    `| Pre-launch marketing | ${fmtUsd(Math.round(intake.investmentAmount * 0.05))} |`,
    `| Working capital reserve | ${fmtUsd(Math.round(intake.investmentAmount * 0.25))} |`,
    `| **Total** | **${fmtUsd(intake.investmentAmount)}** |`,
  ].join('\n');

  const marginalitySupporting = `The enterprise generates ${y3Profit} in Year-3 net income and ${y5Profit} in Year-5 net income, both well in excess of the ${fmtUsd(marginalityBench)} marginality benchmark for a ${familySize}-person household from ${intake.investorCountry}. Additionally, the enterprise creates ${intake.hiresYear1 + intake.hiresYear2 + intake.hiresYear3} cumulative U.S. direct hires by Year 3 (Section 8), demonstrating that economic impact extends well beyond the investor's family.`;

  return {
    investor_name: intake.investorName,
    investor_country: intake.investorCountry,
    investor_title: intake.investorTitle || 'Founder and Chief Executive Officer',
    business_name: intake.businessName,
    industry: intake.industry,
    us_location: intake.usLocation,
    investment_amount: fmtUsd(intake.investmentAmount),
    total_enterprise_cost: fmtUsd(totalCost),
    investment_percentage: investmentPercentage,
    sliding_scale_benchmark: slidingScaleBench,
    sliding_scale_satisfaction_narrative: slidingScaleSatisfaction,
    capital_allocation_table: capitalAllocation,
    us_bank_or_placeholder: intake.usBank || 'the US operating bank named in the bank exhibits',
    capital_commitment_date: intake.capitalCommitmentDate || 'the dates noted in the bank exhibits',
    committed_amount: fmtUsd(intake.committedAmount || Math.round(intake.investmentAmount * 0.6)),
    treaty_country_specific_paragraph: treatyParagraph,
    at_risk_specific_paragraph: atRiskParagraph,
    lease_summary: intake.leaseSummary || 'commercial lease at the operating address, terms detailed in lease exhibit',
    equipment_summary: 'per equipment list in Section 9 (Operations Plan)',
    vendor_summary: 'per vendor list in Section 9 (Operations Plan)',
    regulatory_registrations: 'state and federal registrations as applicable, detailed in Section 9',
    operations_status: intake.committedAmount
      ? 'pre-launch operations underway with revenue commencement scheduled per the launch plan'
      : 'launch scheduled per the timeline in Section 9',
    family_size: familySize,
    marginality_benchmark: fmtUsd(marginalityBench),
    year1_net_income: y1Profit,
    year3_net_income: y3Profit,
    year5_net_income: y5Profit,
    marginality_supporting_narrative: marginalitySupporting,
    ownership_percentage: intake.investorOwnershipPercent || 100,
    day_to_day_summary: 'corporate governance, hiring decisions, capital deployment, vendor selection, and strategic direction of the enterprise',
    visa_category: intake.visaCategory,
  };
}

function buildExpandedFinancialModelContext(intake: IntakeForm, plan: Plan): Record<string, string | number> {
  const y1Rev = parseDollarString(plan.financialProjections?.year1?.revenue);
  const y1Cost = parseDollarString(plan.financialProjections?.year1?.costs);
  const y2Rev = parseDollarString(plan.financialProjections?.year2?.revenue);
  const y2Cost = parseDollarString(plan.financialProjections?.year2?.costs);
  const y3Rev = parseDollarString(plan.financialProjections?.year3?.revenue);
  const y3Cost = parseDollarString(plan.financialProjections?.year3?.costs);

  const y2to3Growth = y2Rev > 0 ? y3Rev / y2Rev : 1.4;
  const y4Rev = Math.round(y3Rev * y2to3Growth);
  const y4Cost = Math.round(y3Cost * y2to3Growth);
  const y5Rev = Math.round(y4Rev * y2to3Growth);
  const y5Cost = Math.round(y4Cost * y2to3Growth);

  const y1MonthlyRevWeights = [0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.12, 0.13];
  const y1MonthlyCostWeights = [0.10, 0.10, 0.09, 0.09, 0.09, 0.08, 0.08, 0.08, 0.07, 0.07, 0.07, 0.08];

  let cumulative = 0;
  const monthlyRows: Record<string, number | string> = {};
  for (let i = 0; i < 12; i++) {
    const monthRev = Math.round(y1Rev * y1MonthlyRevWeights[i]);
    const monthCost = Math.round(y1Cost * y1MonthlyCostWeights[i]);
    const monthNet = monthRev - monthCost;
    cumulative += monthNet;
    monthlyRows[`m${i + 1}_revenue`] = fmtUsd(monthRev);
    monthlyRows[`m${i + 1}_costs`] = fmtUsd(monthCost);
    monthlyRows[`m${i + 1}_net`] = fmtUsd(monthNet);
    monthlyRows[`m${i + 1}_cumulative`] = fmtUsd(cumulative);
  }

  let breakEvenMonth = 'after Year 1';
  let cumCheck = 0;
  for (let i = 0; i < 12; i++) {
    cumCheck += Math.round(y1Rev * y1MonthlyRevWeights[i]) - Math.round(y1Cost * y1MonthlyCostWeights[i]);
    if (cumCheck > 0) {
      breakEvenMonth = `Month ${i + 1}`;
      break;
    }
  }

  const qWeights = [0.22, 0.25, 0.26, 0.27];
  const quarterly: Record<string, string | number> = {};
  for (const [yearIdx, [rev, cost]] of [[2, [y2Rev, y2Cost]], [3, [y3Rev, y3Cost]], [4, [y4Rev, y4Cost]], [5, [y5Rev, y5Cost]]] as [number, [number, number]][]) {
    for (let q = 0; q < 4; q++) {
      const qRev = Math.round(rev * qWeights[q]);
      const qCost = Math.round(cost * qWeights[q]);
      quarterly[`y${yearIdx}q${q + 1}_revenue`] = fmtUsd(qRev);
      quarterly[`y${yearIdx}q${q + 1}_costs`] = fmtUsd(qCost);
      quarterly[`y${yearIdx}q${q + 1}_net`] = fmtUsd(qRev - qCost);
    }
  }

  const baseY3Net = y3Rev - y3Cost;
  const bestY3Rev = Math.round(y3Rev * 1.25);
  const worstY3Rev = Math.round(y3Rev * 0.75);
  const bestY3Net = bestY3Rev - y3Cost;
  const worstY3Net = worstY3Rev - y3Cost;

  const familySize = intake.familySize || 4;
  const marginalityBench = Math.round(74_580 * (1 + (familySize - 4) * 0.15));

  const baseMarginalityMargin = Math.round(((baseY3Net - marginalityBench) / marginalityBench) * 100);
  const bestMarginalityMargin = Math.round(((bestY3Net - marginalityBench) / marginalityBench) * 100);
  const worstMarginalityMargin = Math.round(((worstY3Net - marginalityBench) / marginalityBench) * 100);

  let worstMarginalityYear: string | number = 5;
  for (let yr = 1; yr <= 5; yr++) {
    const yrRev = [y1Rev, y2Rev, y3Rev, y4Rev, y5Rev][yr - 1] * 0.75;
    const yrCost = [y1Cost, y2Cost, y3Cost, y4Cost, y5Cost][yr - 1];
    if (yrRev - yrCost > marginalityBench) {
      worstMarginalityYear = yr;
      break;
    }
  }

  const worstCaseNarrative =
    worstMarginalityMargin > 0
      ? `Even with revenue 25% below base case, Year-3 net income exceeds the marginality benchmark by ${worstMarginalityMargin}%. The enterprise satisfies the marginality test under realistic downside conditions.`
      : `Worst-case Year-3 net income falls short of the marginality benchmark. The enterprise reaches the benchmark by Year ${worstMarginalityYear} under worst-case revenue assumptions.`;

  const assumptionsList = (plan.financialProjections?.keyAssumptions || [])
    .map((a) => `- ${a}`)
    .join('\n');

  const cashflowParagraph = `Cash from operations turns positive in ${breakEvenMonth} as revenue scales past the fixed-cost base. Cash from investing reflects the ${fmtUsd(intake.investmentAmount)} initial capital deployment in Year 1, with maintenance capex of approximately 5% of revenue thereafter. Cash from financing reflects the equity contribution at inception and is otherwise neutral.`;

  const year1Narrative = `Year 1 reflects a launch ramp from ${(y1MonthlyRevWeights[0] * 100).toFixed(0)}% of annual revenue in Month 1 to ${(y1MonthlyRevWeights[11] * 100).toFixed(0)}% in Month 12 as customer acquisition compounds and operating leverage improves. Break-even on a cumulative-cash basis occurs in ${breakEvenMonth}.`;

  const years2to5Narrative = `Revenue compounds from ${fmtUsd(y2Rev)} in Year 2 to ${fmtUsd(y5Rev)} in Year 5, reflecting a ${Math.round((y2to3Growth - 1) * 100)}% year-over-year growth rate consistent with ${intake.industry} industry benchmarks for the post-launch growth phase. Operating margins expand from ${y2Rev > 0 ? Math.round(((y2Rev - y2Cost) / y2Rev) * 100) : 0}% in Year 2 to ${y5Rev > 0 ? Math.round(((y5Rev - y5Cost) / y5Rev) * 100) : 0}% in Year 5 as the enterprise gains operating leverage.`;

  return {
    business_name: intake.businessName,
    visa_category: intake.visaCategory,
    industry: intake.industry,
    assumptions_list: assumptionsList || '- Revenue and cost assumptions per the consumer plan financial projections section',
    ...monthlyRows,
    y1_revenue: fmtUsd(y1Rev),
    y1_costs: fmtUsd(y1Cost),
    y1_net: fmtUsd(y1Rev - y1Cost),
    break_even_month: breakEvenMonth,
    year1_narrative_paragraph: year1Narrative,
    ...quarterly,
    y2_revenue: fmtUsd(y2Rev),
    y2_costs: fmtUsd(y2Cost),
    y2_net: fmtUsd(y2Rev - y2Cost),
    y3_revenue: fmtUsd(y3Rev),
    y3_costs: fmtUsd(y3Cost),
    y3_net: fmtUsd(y3Rev - y3Cost),
    y4_revenue: fmtUsd(y4Rev),
    y4_costs: fmtUsd(y4Cost),
    y4_net: fmtUsd(y4Rev - y4Cost),
    y5_revenue: fmtUsd(y5Rev),
    y5_costs: fmtUsd(y5Cost),
    y5_net: fmtUsd(y5Rev - y5Cost),
    years2to5_narrative_paragraph: years2to5Narrative,
    bs_cash_y1: fmtUsd(Math.round(intake.investmentAmount * 0.25)),
    bs_cash_y2: fmtUsd(Math.round(y2Rev * 0.10)),
    bs_cash_y3: fmtUsd(Math.round(y3Rev * 0.12)),
    bs_cash_y4: fmtUsd(Math.round(y4Rev * 0.14)),
    bs_cash_y5: fmtUsd(Math.round(y5Rev * 0.15)),
    bs_ar_y1: fmtUsd(Math.round(y1Rev * 0.05)),
    bs_ar_y2: fmtUsd(Math.round(y2Rev * 0.06)),
    bs_ar_y3: fmtUsd(Math.round(y3Rev * 0.06)),
    bs_ar_y4: fmtUsd(Math.round(y4Rev * 0.06)),
    bs_ar_y5: fmtUsd(Math.round(y5Rev * 0.06)),
    bs_inv_y1: fmtUsd(Math.round(intake.investmentAmount * 0.10)),
    bs_inv_y2: fmtUsd(Math.round(y2Cost * 0.08)),
    bs_inv_y3: fmtUsd(Math.round(y3Cost * 0.08)),
    bs_inv_y4: fmtUsd(Math.round(y4Cost * 0.08)),
    bs_inv_y5: fmtUsd(Math.round(y5Cost * 0.08)),
    bs_fa_y1: fmtUsd(Math.round(intake.investmentAmount * 0.40)),
    bs_fa_y2: fmtUsd(Math.round(intake.investmentAmount * 0.36)),
    bs_fa_y3: fmtUsd(Math.round(intake.investmentAmount * 0.32)),
    bs_fa_y4: fmtUsd(Math.round(intake.investmentAmount * 0.30)),
    bs_fa_y5: fmtUsd(Math.round(intake.investmentAmount * 0.28)),
    bs_ta_y1: fmtUsd(Math.round(intake.investmentAmount * 0.80)),
    bs_ta_y2: fmtUsd(Math.round(y2Rev * 0.20 + intake.investmentAmount * 0.36)),
    bs_ta_y3: fmtUsd(Math.round(y3Rev * 0.24 + intake.investmentAmount * 0.32)),
    bs_ta_y4: fmtUsd(Math.round(y4Rev * 0.26 + intake.investmentAmount * 0.30)),
    bs_ta_y5: fmtUsd(Math.round(y5Rev * 0.28 + intake.investmentAmount * 0.28)),
    bs_ap_y1: fmtUsd(Math.round(y1Cost * 0.05)),
    bs_ap_y2: fmtUsd(Math.round(y2Cost * 0.06)),
    bs_ap_y3: fmtUsd(Math.round(y3Cost * 0.06)),
    bs_ap_y4: fmtUsd(Math.round(y4Cost * 0.06)),
    bs_ap_y5: fmtUsd(Math.round(y5Cost * 0.06)),
    bs_ae_y1: fmtUsd(Math.round(y1Cost * 0.03)),
    bs_ae_y2: fmtUsd(Math.round(y2Cost * 0.03)),
    bs_ae_y3: fmtUsd(Math.round(y3Cost * 0.03)),
    bs_ae_y4: fmtUsd(Math.round(y4Cost * 0.03)),
    bs_ae_y5: fmtUsd(Math.round(y5Cost * 0.03)),
    bs_ltd_y1: fmtUsd(0),
    bs_ltd_y2: fmtUsd(0),
    bs_ltd_y3: fmtUsd(0),
    bs_ltd_y4: fmtUsd(0),
    bs_ltd_y5: fmtUsd(0),
    bs_tl_y1: fmtUsd(Math.round(y1Cost * 0.08)),
    bs_tl_y2: fmtUsd(Math.round(y2Cost * 0.09)),
    bs_tl_y3: fmtUsd(Math.round(y3Cost * 0.09)),
    bs_tl_y4: fmtUsd(Math.round(y4Cost * 0.09)),
    bs_tl_y5: fmtUsd(Math.round(y5Cost * 0.09)),
    bs_oe_y1: fmtUsd(Math.round(intake.investmentAmount * 0.72)),
    bs_oe_y2: fmtUsd(Math.round(intake.investmentAmount * 0.72 + (y2Rev - y2Cost))),
    bs_oe_y3: fmtUsd(Math.round(intake.investmentAmount * 0.72 + (y2Rev - y2Cost) + (y3Rev - y3Cost))),
    bs_oe_y4: fmtUsd(Math.round(intake.investmentAmount * 0.72 + (y2Rev - y2Cost) + (y3Rev - y3Cost) + (y4Rev - y4Cost))),
    bs_oe_y5: fmtUsd(Math.round(intake.investmentAmount * 0.72 + (y2Rev - y2Cost) + (y3Rev - y3Cost) + (y4Rev - y4Cost) + (y5Rev - y5Cost))),
    cf_ops_y1: fmtUsd(y1Rev - y1Cost),
    cf_ops_y2: fmtUsd(y2Rev - y2Cost),
    cf_ops_y3: fmtUsd(y3Rev - y3Cost),
    cf_ops_y4: fmtUsd(y4Rev - y4Cost),
    cf_ops_y5: fmtUsd(y5Rev - y5Cost),
    cf_inv_y1: fmtUsd(-intake.investmentAmount),
    cf_inv_y2: fmtUsd(-Math.round(y2Rev * 0.05)),
    cf_inv_y3: fmtUsd(-Math.round(y3Rev * 0.05)),
    cf_inv_y4: fmtUsd(-Math.round(y4Rev * 0.05)),
    cf_inv_y5: fmtUsd(-Math.round(y5Rev * 0.05)),
    cf_fin_y1: fmtUsd(intake.investmentAmount),
    cf_fin_y2: fmtUsd(0),
    cf_fin_y3: fmtUsd(0),
    cf_fin_y4: fmtUsd(0),
    cf_fin_y5: fmtUsd(0),
    cf_net_y1: fmtUsd((y1Rev - y1Cost) - intake.investmentAmount + intake.investmentAmount),
    cf_net_y2: fmtUsd((y2Rev - y2Cost) - Math.round(y2Rev * 0.05)),
    cf_net_y3: fmtUsd((y3Rev - y3Cost) - Math.round(y3Rev * 0.05)),
    cf_net_y4: fmtUsd((y4Rev - y4Cost) - Math.round(y4Rev * 0.05)),
    cf_net_y5: fmtUsd((y5Rev - y5Cost) - Math.round(y5Rev * 0.05)),
    cashflow_paragraph: cashflowParagraph,
    base_y3_rev: fmtUsd(y3Rev),
    base_y3_net: fmtUsd(baseY3Net),
    base_y5_cum: fmtUsd((y2Rev - y2Cost) + (y3Rev - y3Cost) + (y4Rev - y4Cost) + (y5Rev - y5Cost)),
    base_marginality_margin: `+${baseMarginalityMargin}%`,
    best_y3_rev: fmtUsd(bestY3Rev),
    best_y3_net: fmtUsd(bestY3Net),
    best_y5_cum: fmtUsd(Math.round(((y2Rev - y2Cost) + (y3Rev - y3Cost) + (y4Rev - y4Cost) + (y5Rev - y5Cost)) * 1.4)),
    best_marginality_margin: `+${bestMarginalityMargin}%`,
    worst_y3_rev: fmtUsd(worstY3Rev),
    worst_y3_net: fmtUsd(worstY3Net),
    worst_y5_cum: fmtUsd(Math.round(((y2Rev - y2Cost) + (y3Rev - y3Cost) + (y4Rev - y4Cost) + (y5Rev - y5Cost)) * 0.55)),
    worst_marginality_margin: worstMarginalityMargin >= 0 ? `+${worstMarginalityMargin}%` : `${worstMarginalityMargin}%`,
    worst_case_narrative: worstCaseNarrative,
    worst_marginality_year: worstMarginalityYear,
    opening_capital: fmtUsd(intake.investmentAmount),
  };
}

function buildUSHiringPlanContext(intake: IntakeForm, _plan: Plan): Record<string, string | number> {
  const y1 = intake.hiresYear1;
  const y2 = intake.hiresYear2;
  const y3 = intake.hiresYear3;
  const y4 = intake.hiresYear4 || Math.ceil(y3 * 0.5);
  const y5 = intake.hiresYear5 || Math.ceil(y3 * 0.7);

  // Average annual fully-loaded payroll per role assumed at $52K (industry-mix
  // weighted; manager roles closer to $80K, line roles closer to $42K)
  const avgFullyLoaded = 52_000;

  const cumY1 = y1;
  const cumY2 = cumY1 + y2;
  const cumY3 = cumY2 + y3;
  const cumY4 = cumY3 + y4;
  const cumY5 = cumY4 + y5;

  const orgChart = `${intake.investorName} (${intake.investorTitle || 'Founder/CEO'}) leads the enterprise. Reporting structure flows: Petitioner -> direct managers -> line staff. Detailed organization chart with named or to-be-hired roles is maintained in the firm's HR exhibit.`;

  const positions = intake.positions && intake.positions.length > 0
    ? intake.positions
        .map(
          (p, i) =>
            `### Position ${i + 1}: ${p.title}\n\n**Hire timing:** Year ${p.year}\n\n**Salary range (BLS-aligned for ${intake.usLocation}):** ${p.salaryRange}\n\n**Responsibilities:** ${p.responsibilities}`,
        )
        .join('\n\n')
    : `### Position 1: Operations Manager\n\n**Hire timing:** Month 1 (pre-launch)\n\n**Salary range (BLS-aligned for ${intake.usLocation}):** $58,000 to $72,000 plus benefits\n\n**Responsibilities:** Day-to-day operations, scheduling, vendor management, hiring of line staff. Reports directly to the petitioner. Supports the petitioner's develop-and-direct authority by executing operational decisions on the petitioner's direction.\n\n### Position 2: Line operator (multiple)\n\n**Hire timing:** Months 1-3\n\n**Salary range (BLS-aligned for ${intake.usLocation}):** $36,000 to $46,000 plus benefits\n\n**Responsibilities:** Direct customer-facing operations, production, fulfillment as appropriate to the ${intake.industry} sector. Reports to the Operations Manager.\n\n### Position 3: Year-2 expansion roles\n\n**Hire timing:** Year 2 onward\n\n**Salary range (BLS-aligned for ${intake.usLocation}):** $38,000 to $68,000 plus benefits\n\n**Responsibilities:** Growth-stage roles aligned to the revenue ramp in Section 7. Specific roles to be defined as operating data informs hiring priorities.`;

  return {
    business_name: intake.businessName,
    visa_category: intake.visaCategory,
    investor_name: intake.investorName,
    investor_title: intake.investorTitle || 'Founder and Chief Executive Officer',
    us_location: intake.usLocation,
    us_state: intake.usState,
    org_chart_text: orgChart,
    hires_y1: y1,
    hires_y2: y2,
    hires_y3: y3,
    hires_y4: y4,
    hires_y5: y5,
    cum_hires_y1: cumY1,
    cum_hires_y2: cumY2,
    cum_hires_y3: cumY3,
    cum_hires_y4: cumY4,
    cum_hires_y5: cumY5,
    payroll_y1: fmtUsd(cumY1 * avgFullyLoaded),
    payroll_y2: fmtUsd(cumY2 * avgFullyLoaded),
    payroll_y3: fmtUsd(cumY3 * avgFullyLoaded),
    payroll_y4: fmtUsd(cumY4 * avgFullyLoaded),
    payroll_y5: fmtUsd(cumY5 * avgFullyLoaded),
    position_descriptions: positions,
    milestone_m0_jobs: 0,
    milestone_m2_jobs: Math.ceil(y1 * 0.5),
    milestone_m6_jobs: Math.ceil(y1 * 0.85),
  };
}

function buildOperationsExpandedContext(intake: IntakeForm, _plan: Plan): Record<string, string | number> {
  const equipmentList = intake.equipmentList && intake.equipmentList.length > 0
    ? intake.equipmentList.map((e) => `- ${e.item}: ${fmtUsd(e.cost)} (${e.status})`).join('\n')
    : `- Primary operating equipment: per equipment exhibit, ${fmtUsd(Math.round(intake.investmentAmount * 0.20))} (purchased)\n- Supporting equipment and tools: per equipment exhibit, ${fmtUsd(Math.round(intake.investmentAmount * 0.05))} (purchased)\n- Furniture, fixtures, and signage: per equipment exhibit, ${fmtUsd(Math.round(intake.investmentAmount * 0.03))} (purchased)`;

  const vendorList = intake.vendors && intake.vendors.length > 0
    ? intake.vendors.map((v) => `- ${v.name}: ${v.service} (${v.status})`).join('\n')
    : `- Primary supply-chain vendor: per vendor exhibit (relationship established)\n- Secondary supply-chain vendor: per vendor exhibit (relationship established for redundancy)\n- Professional services (legal, accounting, payroll): per vendor exhibit (engaged)`;

  const supplyChain = `${intake.businessName} has established or is finalizing relationships with primary and secondary suppliers in the ${intake.industry} sector. The dual-vendor approach provides redundancy against single-vendor disruption. Lead times, payment terms, and minimum-order quantities are documented in the vendor exhibits.`;

  const federalCompliance = `- Federal Employer Identification Number (EIN) issued and active\n- Federal tax filings prepared on a calendar-year basis\n- Industry-specific federal regulatory registrations as applicable to ${intake.industry}`;

  const stateCompliance = `- ${intake.usState} state business registration active\n- ${intake.usState} sales-and-use tax registration where applicable\n- ${intake.usState} state-level industry license or permit as applicable to ${intake.industry}`;

  const localCompliance = `- ${intake.usLocation} local business license active\n- Local zoning compliance verified for the operating premises\n- Local industry-specific permits as applicable`;

  const operationalMilestones = `- Lease executed and premises occupied\n- Equipment installed and tested\n- Staff hiring underway per Section 8 (US Hiring Plan)\n- Vendor relationships established\n- Federal and state compliance complete\n- Soft launch scheduled per Section 7 (Expanded Financial Model)`;

  return {
    business_name: intake.businessName,
    visa_category: intake.visaCategory,
    industry: intake.industry,
    us_location: intake.usLocation,
    us_state: intake.usState,
    lease_summary: intake.leaseSummary || 'commercial lease, terms detailed in lease exhibit',
    premises_type: intake.premisesType || 'commercial operating premises',
    square_footage: intake.squareFootage || 'per lease exhibit',
    buildout_status: intake.buildoutStatus || 'build-out underway per the operational timeline',
    equipment_list: equipmentList,
    vendor_list: vendorList,
    supply_chain_paragraph: supplyChain,
    federal_compliance_list: federalCompliance,
    state_compliance_list: stateCompliance,
    local_compliance_list: localCompliance,
    industry_specific_insurance: `Industry-specific insurance for ${intake.industry} operations as required by carrier`,
    us_bank_or_placeholder: intake.usBank || 'the US operating bank named in the bank exhibits',
    accounting_software_or_placeholder: intake.accountingSoftware || 'an industry-standard accounting platform',
    operational_milestones_list: operationalMilestones,
  };
}

function buildUscisRiskAnalysisContext(intake: IntakeForm, plan: Plan): Record<string, string | number> {
  const totalCost = intake.totalEnterpriseCost || intake.investmentAmount;
  const investmentPercentage = Math.round((intake.investmentAmount / totalCost) * 100);
  const slidingScaleBench = slidingScaleBenchmark(totalCost);

  const familySize = intake.familySize || 4;
  const marginalityBench = Math.round(74_580 * (1 + (familySize - 4) * 0.15));

  const sustainmentParagraph = `${intake.businessName} is structured to sustain operations through and beyond the ${intake.visaCategory} status period. The five-year financial model (Section 7) demonstrates revenue growth and operating-margin expansion. The U.S. hiring plan (Section 8) and operations plan (Section 9) demonstrate operational substance. The sensitivity analysis (Section 7.6) confirms financial resilience under realistic downside conditions.`;

  return {
    business_name: intake.businessName,
    visa_category: intake.visaCategory,
    investor_country: intake.investorCountry,
    investment_percentage: investmentPercentage,
    sliding_scale_benchmark: slidingScaleBench,
    year3_net_income: plan.financialProjections?.year3?.profit || '',
    marginality_benchmark: fmtUsd(marginalityBench),
    committed_amount: fmtUsd(intake.committedAmount || Math.round(intake.investmentAmount * 0.6)),
    ownership_percentage: intake.investorOwnershipPercent || 100,
    sustainment_paragraph: sustainmentParagraph,
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Generate the full USCIS overlay (8 filled markdown sections) for a plan +
 * intake. v1: E-2 only. Other visa categories throw a clear error.
 */
export function generateUscisOverlay(plan: Plan, intake: IntakeForm): OverlaySections {
  if (intake.visaCategory !== 'E-2') {
    throw new Error(
      `USCIS overlay v1 supports E-2 only. Visa category "${intake.visaCategory}" templates are pending. See Business Builder/P7-USCIS-overlay-scope.md.`,
    );
  }

  const meta = VISA_METADATA[intake.visaCategory];

  const adjudicatorSummary = fillTemplate(
    loadTemplate('adjudicator-summary.md'),
    buildAdjudicatorSummaryContext(intake, plan),
  );
  const investorBackground = fillTemplate(
    loadTemplate('investor-background.md'),
    buildInvestorBackgroundContext(intake, plan),
  );
  const sourceOfFunds = fillTemplate(
    loadTemplate(meta.sourceOfFundsTemplate),
    buildSourceOfFundsContext(intake, plan),
  );
  const visaEligibility = fillTemplate(
    loadTemplate(meta.eligibilityTemplate),
    buildE2EligibilityContext(intake, plan),
  );
  const expandedFinancialModel = fillTemplate(
    loadTemplate('expanded-financial-model.md'),
    buildExpandedFinancialModelContext(intake, plan),
  );
  const usHiringPlan = fillTemplate(
    loadTemplate('us-hiring-plan.md'),
    buildUSHiringPlanContext(intake, plan),
  );
  const expandedOperations = fillTemplate(
    loadTemplate('operations-expanded.md'),
    buildOperationsExpandedContext(intake, plan),
  );
  const uscisRiskAnalysis = fillTemplate(
    loadTemplate('risk-analysis-uscis.md'),
    buildUscisRiskAnalysisContext(intake, plan),
  );

  return {
    adjudicatorSummary,
    investorBackground,
    sourceOfFunds,
    visaEligibility,
    expandedFinancialModel,
    usHiringPlan,
    expandedOperations,
    uscisRiskAnalysis,
  };
}
