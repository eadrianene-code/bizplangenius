/**
 * TypeScript types for the BizPlan Genius plan JSON.
 * Matches the structure produced by buildStructurePrompt() in src/app/api/fulfill/route.ts.
 *
 * All fields are optional because the AI structurer is best-effort and may omit
 * fields when the underlying research is thin. The docx generator must handle
 * missing fields gracefully (skip the section, not crash).
 */

export interface ExecutiveSummary {
  overview?: string;
  mission?: string;
  vision?: string;
  valueProposition?: string;
  keyMetrics?: string[];
}

export interface Competitor {
  name?: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  estimatedRevenue?: string;
  pricing?: string;
}

export interface CompetitorAnalysis {
  overview?: string;
  competitors?: Competitor[];
  competitiveAdvantage?: string;
  marketGaps?: string[];
}

export interface TargetCustomerProfile {
  demographics?: string;
  psychographics?: string;
  painPoints?: string[];
  buyingBehavior?: string;
}

export interface MarketAnalysis {
  industryOverview?: string;
  marketSize?: string;
  growthRate?: string;
  trends?: string[];
  targetCustomerProfile?: TargetCustomerProfile;
}

export interface MarketingChannel {
  channel?: string;
  strategy?: string;
  estimatedCAC?: string;
  priority?: string;
}

export interface MarketingStrategy {
  positioning?: string;
  channels?: MarketingChannel[];
  contentStrategy?: string;
  launchPlan?: string;
}

export interface YearProjection {
  revenue?: string;
  costs?: string;
  profit?: string;
  customers?: string;
}

export interface StartupCost {
  item?: string;
  amount?: string;
}

export interface FinancialProjections {
  revenueModel?: string;
  year1?: YearProjection;
  year2?: YearProjection;
  year3?: YearProjection;
  year4?: YearProjection;
  year5?: YearProjection;
  keyAssumptions?: string[];
  breakEvenTimeline?: string;
  startupCosts?: StartupCost[];
}

export interface KeyMilestone {
  timeline?: string;
  milestone?: string;
}

export interface OperationsPlan {
  businessModel?: string;
  teamStructure?: string;
  technology?: string;
  keyMilestones?: KeyMilestone[];
}

export interface Risk {
  risk?: string;
  likelihood?: string;
  impact?: string;
  mitigation?: string;
}

export interface RiskAnalysis {
  risks?: Risk[];
}

export interface Plan {
  executiveSummary?: ExecutiveSummary;
  competitorAnalysis?: CompetitorAnalysis;
  marketAnalysis?: MarketAnalysis;
  marketingStrategy?: MarketingStrategy;
  financialProjections?: FinancialProjections;
  operationsPlan?: OperationsPlan;
  riskAnalysis?: RiskAnalysis;
  // USCIS overlay sections (added by P7, included here for type safety)
  adjudicatorSummary?: AdjudicatorSummary;
  investorBackground?: InvestorBackground;
  sourceOfFunds?: SourceOfFunds;
  visaEligibility?: VisaEligibility;
  expandedFinancialModel?: ExpandedFinancialModel;
  usHiringPlan?: USHiringPlan;
  expandedOperations?: ExpandedOperations;
  uscisRiskAnalysis?: USCISRiskAnalysis;
}

// USCIS overlay placeholder types (filled in P7)
export interface AdjudicatorSummary {
  visaCategory?: string;
  investorName?: string;
  formNumber?: string;
  prongMapping?: { prong: string; planSection: string; summary: string }[];
}
export interface InvestorBackground {
  name?: string;
  country?: string;
  professionalBackground?: string;
  education?: string;
  businessExperience?: string;
  qualificationNarrative?: string;
}
export interface SourceOfFunds {
  summary?: string;
  sources?: { source: string; amount: string; documentation: string }[];
  totalAmount?: string;
}
export interface VisaEligibility {
  visaCategory?: string;
  sections?: { heading: string; body: string }[];
}
export interface ExpandedFinancialModel {
  monthlyY1?: { month: string; revenue: string; costs: string; netCash: string }[];
  quarterlyY2to5?: { period: string; revenue: string; costs: string; netCash: string }[];
  balanceSheet?: { line: string; year1: string; year2: string; year3: string; year4: string; year5: string }[];
  cashFlow?: string;
  sensitivity?: { scenario: string; revenueMultiplier: string; outcome: string }[];
  assumptions?: string[];
}
export interface USHiringPlan {
  orgChart?: string;
  positions?: { title: string; year: string; salaryRange: string; responsibilities: string }[];
  jobCreationTimeline?: { milestone: string; cumulativeJobs: string }[];
  economicMultiplier?: { directJobs: string; indirectJobs: string; inducedJobs: string };
}
export interface ExpandedOperations {
  location?: string;
  leaseAssumptions?: string;
  equipment?: string[];
  vendors?: string[];
  supplyChain?: string;
  regulatoryCompliance?: { level: string; requirement: string }[];
}
export interface USCISRiskAnalysis {
  visaSpecificRisks?: { risk: string; likelihood: string; impact: string; mitigation: string }[];
}

export interface PlanMetadata {
  businessName: string;
  industry?: string;
  location?: string;
  tier?: 'starter' | 'pro';
}

export interface DocxOptions {
  /**
   * When true, strips ALL BizPlan Genius branding from the document.
   * - Cover page: shows only business name + date
   * - No header/footer text referencing BPG
   * - No "Prepared with BizPlan Genius" tag
   * - No "CONFIDENTIAL" stock disclaimer
   * - No bizplangenius.com URL anywhere
   * Required for B2B counsel deliveries.
   */
  whiteLabel: boolean;

  /**
   * When set, the cover page sub-line shows this firm name instead of nothing.
   * E.g. "Prepared for [Smith Immigration Law]". Optional.
   */
  preparedForFirm?: string;

  /**
   * ISO date string for the cover page. Defaults to today.
   */
  date?: string;

  /**
   * When true, includes USCIS overlay sections (P7). Default false.
   */
  includeUscisOverlay?: boolean;
}
