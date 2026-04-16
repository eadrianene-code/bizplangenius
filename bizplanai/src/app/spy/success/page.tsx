'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const DARK = '#1a1a2e';
const ACCENT = '#16537e';
const ACCENT_LIGHT = '#e8f0f7';
const TEXT = '#2d2d2d';
const TEXT_LIGHT = '#555555';
const TEXT_MUTED = '#888888';
const LINE = '#cccccc';
const LINE_LIGHT = '#e0e0e0';
const SUCCESS_GREEN = '#27ae60';
const DANGER_RED = '#c0392b';
const WARNING_AMBER = '#d4850a';

interface PricingTier {
  name: string;
  price: string | number;
  features: string[];
}

interface Strength {
  title?: string;
  description?: string;
}

interface Weakness {
  title?: string;
  description?: string;
}

interface Competitor {
  name: string;
  url: string;
  description: string;
  category?: 'Direct' | 'Indirect' | 'Emerging';
  founded?: number;
  estimatedSize?: string;
  fundingRaised?: string;
  reviewRating?: number;
  pricing?: {
    model: string;
    tiers: PricingTier[];
  };
  targetCustomer: string;
  strengths: (string | Strength)[];
  weaknesses: (string | Weakness)[];
  uniqueFeatures?: string[];
  customerSentiment: string;
  marketPosition: string;
  biggestVulnerability?: string;
}

interface KeyTrend {
  trend?: string;
  dataPoint?: string;
  implication?: string;
}

interface PricingComparison {
  summary: string;
  lowestPrice: string | number;
  highestPrice: string | number;
  averagePrice: string | number;
  pricingTrends: string;
  priceGaps?: string;
  pricingModelsBreakdown?: string;
}

interface PositioningGap {
  gap?: string;
  whyExists?: string;
  opportunity?: string;
}

interface PositioningMap {
  xAxis: string;
  yAxis: string;
  positions: Array<{
    company: string;
    x: number;
    y: number;
    quadrant: string;
  }>;
  gaps: (string | PositioningGap)[];
}

interface SwotItem {
  point?: string;
  reasoning?: string;
}

interface SwotAnalysis {
  strengths: (string | SwotItem)[];
  weaknesses: (string | SwotItem)[];
  opportunities: (string | SwotItem)[];
  threats: (string | SwotItem)[];
}

interface DifferentiationStrategy {
  strategy: string;
  reasoning: string;
  roi?: string;
  ease?: string;
}

interface ExploitationPlan {
  action: string;
  details?: string;
  expectedOutcome?: string;
}

interface Opportunity {
  title: string;
  gapDescription: string;
  evidence: string;
  strategicRationale?: string;
  exploitationPlan?: ExploitationPlan[];
  estimatedImpact: string;
  impactReasoning?: string;
  difficulty: string;
  timeline: string;
  risks?: string;
  mitigation?: string;
  differentiation?: string;
}

interface VulnerabilityAuditItem {
  competitorName: string;
  biggestWeakness: string;
  featureGaps: string;
  pricingVulnerability: string;
  customerFriction: string;
  positioningGap: string;
  techDebt?: string;
}

interface TacticalRoadmapPhase {
  action: string;
  details?: string;
  expectedOutcome?: string;
}

interface TacticalRoadmap {
  week1to2?: TacticalRoadmapPhase[];
  week3to4?: TacticalRoadmapPhase[];
  month2?: TacticalRoadmapPhase[];
  month3?: TacticalRoadmapPhase[];
}

interface DifferentiationOpportunity {
  opportunity: string;
  reasoning: string;
  difficulty: string;
  impact: string;
}

interface StrategicRecommendations {
  differentiationOpportunities: DifferentiationOpportunity[];
  topDifferentiationStrategies?: DifferentiationStrategy[];
  pricingStrategy?: string;
  recommendedPricePoints?: string;
  positioningStatement?: string;
  buildFirst?: string[];
  avoid?: string[];
  goToMarketStrategy?: string;
  marketingAngles: string[];
  quickWins?: string[];
}

interface ReportData {
  reportType: 'company' | 'industry';
  targetCompany?: {
    name: string;
    url: string;
    description: string;
    industry: string;
    founded: number;
    estimatedSize: string;
    pricing: string;
    targetCustomer: string;
    uniqueSellingPoint: string;
  };
  industryTarget?: {
    description: string;
    category: string;
    nicheDefinition: string;
  };
  executiveSummary?: string;
  marketOverview: {
    industryName: string;
    marketSize: string;
    growthRate: string;
    keyTrends: (string | KeyTrend)[];
    marketDrivers: string;
    threatFactors: string;
    regulatoryConsiderations?: string;
  };
  competitors: Competitor[];
  vulnerabilityAudit?: VulnerabilityAuditItem[];
  opportunityEngineering?: Opportunity[];
  pricingComparison: PricingComparison;
  positioningMap: PositioningMap;
  swotAnalysis: SwotAnalysis;
  tacticalRoadmap?: TacticalRoadmap;
  strategicRecommendations: StrategicRecommendations;
  disclaimer?: string;
  generatedAt?: string;
}

function loadPdfMake(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfMake) {
      resolve();
      return;
    }
    const s1 = document.createElement('script');
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js';
      s2.onload = () => resolve();
      s2.onerror = reject;
      document.head.appendChild(s2);
    };
    s1.onerror = reject;
    document.head.appendChild(s1);
  });
}

function generatePDF(data: ReportData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const pdfMake = (window as any).pdfMake;
      if (!pdfMake) {
        reject(new Error('pdfMake not loaded'));
        return;
      }

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const reportTitle =
        data.reportType === 'company'
          ? data.targetCompany?.name || 'Competitor Analysis'
          : data.industryTarget?.category || 'Industry Analysis';

      const docDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 60],
        defaultStyle: {
          font: 'Roboto',
          fontSize: 11,
          color: TEXT,
          lineHeight: 1.5,
        },
        styles: {
          header: {
            fontSize: 28,
            bold: true,
            color: DARK,
            margin: [0, 0, 0, 10],
          },
          subheader: {
            fontSize: 18,
            bold: true,
            color: ACCENT,
            margin: [0, 15, 0, 10],
          },
          sectionTitle: {
            fontSize: 14,
            bold: true,
            color: DARK,
            margin: [0, 12, 0, 8],
            background: ACCENT_LIGHT,
            padding: [8, 8, 8, 8],
          },
          tableHeader: {
            bold: true,
            color: 'white',
            fillColor: ACCENT,
            alignment: 'left',
          },
          smallText: {
            fontSize: 10,
            color: TEXT_LIGHT,
          },
          label: {
            fontSize: 10,
            bold: true,
            color: ACCENT,
          },
        },
        content: [
          {
            text: 'COMPETITOR SPY REPORT',
            style: 'header',
            alignment: 'center',
            margin: [0, 80, 0, 30],
          },
          {
            text: reportTitle,
            fontSize: 24,
            bold: true,
            color: ACCENT,
            alignment: 'center',
            margin: [0, 0, 0, 40],
          },
          {
            text: `Last updated: ${dateStr}`,
            fontSize: 12,
            alignment: 'center',
            color: TEXT_LIGHT,
            margin: [0, 0, 0, 8],
          },
          {
            text: 'Data sourced live via Google Search grounding',
            fontSize: 9,
            alignment: 'center',
            color: TEXT_LIGHT,
            italics: true,
            margin: [0, 0, 0, 60],
          },
          {
            text: 'Powered by BizPlan Genius',
            fontSize: 11,
            alignment: 'center',
            color: ACCENT,
            bold: true,
            margin: [0, 80, 0, 0],
          },
          { text: '', pageBreak: 'after' },

          // Executive Summary
          ...(data.executiveSummary ? [
            { text: 'Executive Summary', style: 'sectionTitle' },
            {
              text: data.executiveSummary,
              margin: [0, 8, 0, 20] as [number, number, number, number],
              lineHeight: 1.6,
            },
            { text: '', pageBreak: 'after' as const },
          ] : []),

          { text: 'Market Overview', style: 'sectionTitle' },
          {
            text: `Industry: ${data.marketOverview.industryName}`,
            margin: [0, 8, 0, 4],
          },
          {
            text: `Market Size: ${data.marketOverview.marketSize}`,
            margin: [0, 4, 0, 4],
          },
          {
            text: `Growth Rate: ${data.marketOverview.growthRate}`,
            margin: [0, 4, 0, 4],
          },
          {
            text: 'Key Trends:',
            style: 'label',
            margin: [0, 10, 0, 4],
          },
          {
            ul: data.marketOverview.keyTrends.map((t) =>
              typeof t === 'string' ? t : t.trend || 'Trend'
            ),
            margin: [20, 0, 0, 10],
          },
          {
            text: 'Market Drivers:',
            style: 'label',
            margin: [0, 8, 0, 4],
          },
          {
            text: data.marketOverview.marketDrivers,
            margin: [0, 0, 0, 10],
          },
          {
            text: 'Threat Factors:',
            style: 'label',
            margin: [0, 8, 0, 4],
          },
          {
            text: data.marketOverview.threatFactors,
            margin: [0, 0, 0, 20],
          },
          { text: '', pageBreak: 'after' },

          { text: 'Competitor Profiles', style: 'sectionTitle' },
          ...data.competitors.flatMap((comp, idx) => {
            const content: any[] = [
              {
                text: comp.name,
                fontSize: 13,
                bold: true,
                color: ACCENT,
                margin: [0, 12, 0, 6],
              },
              {
                text: comp.url,
                style: 'smallText',
                color: '#0066cc',
                margin: [0, 0, 0, 6],
              },
              {
                text: comp.description,
                margin: [0, 0, 0, 8],
              },
              {
                columns: [
                  {
                    width: '50%',
                    stack: [
                      { text: 'Target Customer:', style: 'label' },
                      { text: comp.targetCustomer, style: 'smallText', margin: [0, 0, 0, 8] },
                      { text: 'Market Position:', style: 'label' },
                      {
                        text: comp.marketPosition,
                        style: 'smallText',
                        margin: [0, 0, 0, 8],
                      },
                    ],
                  },
                  {
                    width: '50%',
                    stack: [
                      { text: 'Customer Sentiment:', style: 'label' },
                      {
                        text: comp.customerSentiment,
                        style: 'smallText',
                        margin: [0, 0, 0, 8],
                      },
                      comp.estimatedSize
                        ? {
                            text: `Size: ${comp.estimatedSize}`,
                            style: 'smallText',
                            margin: [0, 0, 0, 8],
                          }
                        : null,
                    ].filter(Boolean),
                  },
                ],
                margin: [0, 0, 0, 8],
              },
            ];

            if (comp.pricing?.tiers && comp.pricing.tiers.length > 0) {
              content.push({
                text: `Pricing (${comp.pricing.model}):`,
                style: 'label',
                margin: [0, 6, 0, 4],
              });
              content.push({
                table: {
                  headerRows: 1,
                  widths: ['30%', '20%', '50%'],
                  body: [
                    [
                      { text: 'Plan', style: 'tableHeader' },
                      { text: 'Price', style: 'tableHeader' },
                      { text: 'Features', style: 'tableHeader' },
                    ],
                    ...comp.pricing.tiers.map((tier) => [
                      tier.name,
                      String(tier.price),
                      tier.features.slice(0, 2).join(', '),
                    ]),
                  ],
                },
                margin: [0, 0, 0, 8],
                fontSize: 9,
              });
            }

            if (comp.strengths.length > 0) {
              content.push({
                text: 'Strengths:',
                style: 'label',
                margin: [0, 6, 0, 4],
                color: SUCCESS_GREEN,
              });
              content.push({
                ul: comp.strengths.slice(0, 6).map((s) =>
                  typeof s === 'string' ? s : s.title || 'Strength'
                ),
                margin: [20, 0, 0, 8],
                color: SUCCESS_GREEN,
              });
            }

            if (comp.weaknesses.length > 0) {
              content.push({
                text: 'Weaknesses:',
                style: 'label',
                margin: [0, 6, 0, 4],
                color: DANGER_RED,
              });
              content.push({
                ul: comp.weaknesses.slice(0, 8).map((w) =>
                  typeof w === 'string' ? w : w.title || 'Weakness'
                ),
                margin: [20, 0, 0, 8],
                color: DANGER_RED,
              });
            }

            if (idx < data.competitors.length - 1) {
              content.push({
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: LINE_LIGHT },
                ],
                margin: [0, 10, 0, 10],
              });
            }

            return content;
          }),
          { text: '', pageBreak: 'after' },

          { text: 'Pricing Comparison', style: 'sectionTitle' },
          {
            text: data.pricingComparison.summary,
            margin: [0, 0, 0, 10],
          },
          {
            columns: [
              {
                width: '25%',
                stack: [
                  { text: 'Lowest Price:', style: 'label' },
                  { text: String(data.pricingComparison.lowestPrice), margin: [0, 0, 0, 10] },
                ],
              },
              {
                width: '25%',
                stack: [
                  { text: 'Highest Price:', style: 'label' },
                  { text: String(data.pricingComparison.highestPrice), margin: [0, 0, 0, 10] },
                ],
              },
              {
                width: '25%',
                stack: [
                  { text: 'Average Price:', style: 'label' },
                  { text: String(data.pricingComparison.averagePrice), margin: [0, 0, 0, 10] },
                ],
              },
              {
                width: '25%',
                stack: [
                  { text: 'Trend:', style: 'label' },
                  { text: data.pricingComparison.pricingTrends, style: 'smallText' },
                ],
              },
            ],
            margin: [0, 0, 0, 20],
          },
          { text: '', pageBreak: 'after' },

          { text: 'Market Positioning', style: 'sectionTitle' },
          {
            text: `Dimensions: ${data.positioningMap.xAxis} (X-axis) vs ${data.positioningMap.yAxis} (Y-axis)`,
            margin: [0, 0, 0, 10],
          },
          {
            table: {
              headerRows: 1,
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  { text: 'Company', style: 'tableHeader' },
                  { text: 'X Position', style: 'tableHeader' },
                  { text: 'Y Position', style: 'tableHeader' },
                  { text: 'Quadrant', style: 'tableHeader' },
                ],
                ...data.positioningMap.positions.map((pos) => [
                  pos.company,
                  String(pos.x),
                  String(pos.y),
                  pos.quadrant,
                ]),
              ],
            },
            margin: [0, 0, 0, 10],
          },
          data.positioningMap.gaps.length > 0
            ? {
                text: 'Market Gaps:',
                style: 'label',
                margin: [0, 10, 0, 4],
              }
            : null,
          data.positioningMap.gaps.length > 0
            ? {
                ul: data.positioningMap.gaps.map((g) =>
                  typeof g === 'string' ? g : g.gap || 'Gap'
                ),
                margin: [20, 0, 0, 20],
              }
            : null,
          { text: '', pageBreak: 'after' },

          { text: 'SWOT Analysis', style: 'sectionTitle' },
          {
            columns: [
              {
                width: '50%',
                stack: [
                  {
                    text: 'Strengths',
                    fontSize: 12,
                    bold: true,
                    color: SUCCESS_GREEN,
                    margin: [0, 0, 0, 6],
                  },
                  {
                    ul: data.swotAnalysis.strengths
                      .slice(0, 5)
                      .map((item) =>
                        typeof item === 'string' ? item : item.point || 'Strength'
                      ),
                    color: SUCCESS_GREEN,
                  },
                ],
              },
              {
                width: '50%',
                stack: [
                  {
                    text: 'Weaknesses',
                    fontSize: 12,
                    bold: true,
                    color: DANGER_RED,
                    margin: [0, 0, 0, 6],
                  },
                  {
                    ul: data.swotAnalysis.weaknesses
                      .slice(0, 5)
                      .map((item) =>
                        typeof item === 'string' ? item : item.point || 'Weakness'
                      ),
                    color: DANGER_RED,
                  },
                ],
              },
            ],
            margin: [0, 0, 0, 12],
          },
          {
            columns: [
              {
                width: '50%',
                stack: [
                  {
                    text: 'Opportunities',
                    fontSize: 12,
                    bold: true,
                    color: WARNING_AMBER,
                    margin: [0, 0, 0, 6],
                  },
                  {
                    ul: data.swotAnalysis.opportunities
                      .slice(0, 5)
                      .map((item) =>
                        typeof item === 'string' ? item : item.point || 'Opportunity'
                      ),
                    color: WARNING_AMBER,
                  },
                ],
              },
              {
                width: '50%',
                stack: [
                  {
                    text: 'Threats',
                    fontSize: 12,
                    bold: true,
                    color: '#d35400',
                    margin: [0, 0, 0, 6],
                  },
                  {
                    ul: data.swotAnalysis.threats
                      .slice(0, 5)
                      .map((item) =>
                        typeof item === 'string' ? item : item.point || 'Threat'
                      ),
                    color: '#d35400',
                  },
                ],
              },
            ],
            margin: [0, 0, 0, 20],
          },
          { text: '', pageBreak: 'after' },

          // Vulnerability Audit
          ...(data.vulnerabilityAudit && data.vulnerabilityAudit.length > 0 ? [
            { text: 'Vulnerability Audit', style: 'sectionTitle' },
            ...data.vulnerabilityAudit.flatMap((audit: VulnerabilityAuditItem) => [
              { text: audit.competitorName, fontSize: 13, bold: true, color: DANGER_RED, margin: [0, 10, 0, 4] as [number, number, number, number] },
              { text: `Biggest Weakness: ${audit.biggestWeakness}`, fontSize: 10, bold: true, color: DANGER_RED, margin: [0, 0, 0, 4] as [number, number, number, number] },
              {
                table: {
                  widths: ['30%', '70%'],
                  body: [
                    [{ text: 'Feature Gaps', style: 'label' }, { text: audit.featureGaps || 'N/A', fontSize: 10 }],
                    [{ text: 'Pricing Vulnerability', style: 'label' }, { text: audit.pricingVulnerability || 'N/A', fontSize: 10 }],
                    [{ text: 'Customer Friction', style: 'label' }, { text: audit.customerFriction || 'N/A', fontSize: 10 }],
                    [{ text: 'Positioning Gap', style: 'label' }, { text: audit.positioningGap || 'N/A', fontSize: 10 }],
                    ...(audit.techDebt ? [[{ text: 'Tech Debt', style: 'label' }, { text: audit.techDebt, fontSize: 10 }]] : []),
                  ],
                },
                layout: 'lightHorizontalLines',
                margin: [0, 0, 0, 12] as [number, number, number, number],
              },
            ]),
            { text: '', pageBreak: 'after' as const },
          ] : []),

          // Opportunity Engineering
          ...(data.opportunityEngineering && data.opportunityEngineering.length > 0 ? [
            { text: 'Opportunity Engineering', style: 'sectionTitle' },
            { text: 'Concrete opportunities to exploit competitor gaps and capture market share.', style: 'smallText', margin: [0, 0, 0, 12] as [number, number, number, number] },
            ...data.opportunityEngineering.flatMap((opp: Opportunity, idx: number) => [
              { text: `${idx + 1}. ${opp.title}`, fontSize: 13, bold: true, color: SUCCESS_GREEN, margin: [0, 10, 0, 4] as [number, number, number, number] },
              { text: opp.gapDescription, margin: [0, 0, 0, 4] as [number, number, number, number], fontSize: 10 },
              ...(opp.evidence ? [{ text: `Evidence: ${opp.evidence}`, style: 'smallText', italics: true, margin: [0, 0, 0, 4] as [number, number, number, number] }] : []),
              {
                columns: [
                  { text: `Impact: ${opp.estimatedImpact}`, style: 'label', width: '33%' },
                  { text: `Difficulty: ${opp.difficulty}`, style: 'label', width: '33%' },
                  { text: `Timeline: ${opp.timeline}`, style: 'label', width: '33%' },
                ],
                margin: [0, 4, 0, 4] as [number, number, number, number],
              },
              ...(opp.exploitationPlan && opp.exploitationPlan.length > 0 ? [
                { text: 'Exploitation Plan:', style: 'label', margin: [0, 4, 0, 2] as [number, number, number, number] },
                { ol: opp.exploitationPlan.map((step: ExploitationPlan) => step.action), margin: [20, 0, 0, 4] as [number, number, number, number], fontSize: 10 },
              ] : []),
              ...(opp.risks ? [{ text: `Risks: ${opp.risks}`, style: 'smallText', color: WARNING_AMBER, margin: [0, 2, 0, 2] as [number, number, number, number] }] : []),
              ...(opp.mitigation ? [{ text: `Mitigation: ${opp.mitigation}`, style: 'smallText', margin: [0, 0, 0, 8] as [number, number, number, number] }] : []),
            ]),
            { text: '', pageBreak: 'after' as const },
          ] : []),

          // 90-Day Tactical Roadmap
          ...(data.tacticalRoadmap ? (() => {
            const phases = [
              { key: 'week1to2' as const, label: 'Week 1-2: Foundation' },
              { key: 'week3to4' as const, label: 'Week 3-4: Acceleration' },
              { key: 'month2' as const, label: 'Month 2: Scaling' },
              { key: 'month3' as const, label: 'Month 3: Consolidation' },
            ];
            const phaseContent = phases.flatMap(({ key, label }) => {
              const items = data.tacticalRoadmap?.[key];
              if (!items || items.length === 0) return [];
              return [
                { text: label, fontSize: 12, bold: true, color: ACCENT, margin: [0, 10, 0, 6] as [number, number, number, number] },
                ...items.map((item: TacticalRoadmapPhase) => ({
                  stack: [
                    { text: item.action, bold: true, fontSize: 10, margin: [0, 0, 0, 2] as [number, number, number, number] },
                    ...(item.details ? [{ text: item.details, fontSize: 9, color: TEXT_LIGHT, margin: [0, 0, 0, 2] as [number, number, number, number] }] : []),
                    ...(item.expectedOutcome ? [{ text: `Expected: ${item.expectedOutcome}`, fontSize: 9, color: ACCENT, margin: [0, 0, 0, 6] as [number, number, number, number] }] : []),
                  ],
                  margin: [10, 0, 0, 0] as [number, number, number, number],
                })),
              ];
            });
            if (phaseContent.length === 0) return [];
            return [
              { text: '90-Day Tactical Roadmap', style: 'sectionTitle' },
              ...phaseContent,
              { text: '', pageBreak: 'after' as const },
            ];
          })() : []),

          // Strategic Recommendations (full version)
          { text: 'Strategic Recommendations', style: 'sectionTitle' },
          ...(data.strategicRecommendations.positioningStatement ? [
            { text: 'Positioning Statement:', style: 'label', margin: [0, 8, 0, 4] as [number, number, number, number] },
            { text: data.strategicRecommendations.positioningStatement, fontSize: 12, bold: true, color: DARK, margin: [0, 0, 0, 12] as [number, number, number, number] },
          ] : []),
          ...(data.strategicRecommendations.topDifferentiationStrategies && data.strategicRecommendations.topDifferentiationStrategies.length > 0 ? [
            { text: 'Top Differentiation Strategies:', style: 'label', margin: [0, 8, 0, 4] as [number, number, number, number] },
            ...data.strategicRecommendations.topDifferentiationStrategies.map((strat: DifferentiationStrategy, idx: number) => ({
              stack: [
                { text: `${idx + 1}. ${strat.strategy}`, bold: true, fontSize: 11, margin: [0, 4, 0, 2] as [number, number, number, number] },
                { text: strat.reasoning, fontSize: 10, color: TEXT_LIGHT, margin: [0, 0, 0, 2] as [number, number, number, number] },
                ...(strat.roi || strat.ease ? [{ text: `ROI: ${strat.roi || 'N/A'} | Ease: ${strat.ease || 'N/A'}`, fontSize: 9, color: ACCENT, margin: [0, 0, 0, 6] as [number, number, number, number] }] : []),
              ],
            })),
          ] : [
            { text: 'Differentiation Strategies:', style: 'label', margin: [0, 8, 0, 4] as [number, number, number, number] },
            ...data.strategicRecommendations.differentiationOpportunities.slice(0, 5).map((opp: DifferentiationOpportunity, idx: number) => ({
              text: `${idx + 1}. ${opp.opportunity}${opp.reasoning ? ' - ' + opp.reasoning : ''}`,
              margin: [0, 2, 0, 4] as [number, number, number, number],
              fontSize: 10,
            })),
          ]),
          ...(data.strategicRecommendations.pricingStrategy ? [
            { text: 'Pricing Strategy:', style: 'label', margin: [0, 10, 0, 4] as [number, number, number, number] },
            { text: data.strategicRecommendations.pricingStrategy, fontSize: 10, margin: [0, 0, 0, 4] as [number, number, number, number] },
          ] : []),
          ...(data.strategicRecommendations.recommendedPricePoints ? [
            { text: 'Recommended Price Points:', style: 'label', margin: [0, 6, 0, 4] as [number, number, number, number] },
            { text: data.strategicRecommendations.recommendedPricePoints, fontSize: 10, margin: [0, 0, 0, 4] as [number, number, number, number] },
          ] : []),
          ...(data.strategicRecommendations.goToMarketStrategy ? [
            { text: 'Go-To-Market Strategy:', style: 'label', margin: [0, 10, 0, 4] as [number, number, number, number] },
            { text: data.strategicRecommendations.goToMarketStrategy, fontSize: 10, margin: [0, 0, 0, 8] as [number, number, number, number] },
          ] : []),
          ...(data.strategicRecommendations.marketingAngles && data.strategicRecommendations.marketingAngles.length > 0 ? [
            { text: 'Marketing Angles:', style: 'label', margin: [0, 8, 0, 4] as [number, number, number, number] },
            { ul: data.strategicRecommendations.marketingAngles, margin: [20, 0, 0, 8] as [number, number, number, number], fontSize: 10 },
          ] : []),
          ...((data.strategicRecommendations.buildFirst && data.strategicRecommendations.buildFirst.length > 0) ||
            (data.strategicRecommendations.avoid && data.strategicRecommendations.avoid.length > 0) ? [
            {
              columns: [
                ...(data.strategicRecommendations.buildFirst && data.strategicRecommendations.buildFirst.length > 0 ? [{
                  width: '50%',
                  stack: [
                    { text: 'Build First:', style: 'label', color: SUCCESS_GREEN, margin: [0, 0, 0, 4] as [number, number, number, number] },
                    { ul: data.strategicRecommendations.buildFirst, color: SUCCESS_GREEN, fontSize: 10, margin: [10, 0, 0, 0] as [number, number, number, number] },
                  ],
                }] : []),
                ...(data.strategicRecommendations.avoid && data.strategicRecommendations.avoid.length > 0 ? [{
                  width: '50%',
                  stack: [
                    { text: 'Avoid:', style: 'label', color: DANGER_RED, margin: [0, 0, 0, 4] as [number, number, number, number] },
                    { ul: data.strategicRecommendations.avoid, color: DANGER_RED, fontSize: 10, margin: [10, 0, 0, 0] as [number, number, number, number] },
                  ],
                }] : []),
              ],
              margin: [0, 8, 0, 12] as [number, number, number, number],
            },
          ] : []),
          { text: '', pageBreak: 'after' },
        ].filter(Boolean),
      };

      pdfMake.createPdf(docDefinition).download(`Competitor_Spy_Report_${reportTitle.replace(/\s+/g, '_')}.pdf`);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

const renderStrengthText = (s: string | Strength): string => {
  if (typeof s === 'string') return s;
  return s.title || 'Strength';
};

const renderWeaknessText = (w: string | Weakness): string => {
  if (typeof w === 'string') return w;
  return w.title || 'Weakness';
};

const renderSwotText = (item: string | SwotItem): string => {
  if (typeof item === 'string') return item;
  return item.point || 'Item';
};

const renderTrendText = (trend: string | KeyTrend): string => {
  if (typeof trend === 'string') return trend;
  return trend.trend || 'Trend';
};

const renderGapText = (gap: string | PositioningGap): string => {
  if (typeof gap === 'string') return gap;
  return gap.gap || 'Gap';
};

/* ------------------------------------------------------------------ */
/*  Normalize report data to prevent crashes from shape mismatches     */
/* ------------------------------------------------------------------ */

function normalizeReport(raw: any): ReportData {
  const r = raw || {};

  // Ensure arrays exist
  const competitors = (r.competitors || []).map((c: any) => ({
    ...c,
    strengths: Array.isArray(c.strengths) ? c.strengths : [],
    weaknesses: Array.isArray(c.weaknesses) ? c.weaknesses : [],
    uniqueFeatures: Array.isArray(c.uniqueFeatures) ? c.uniqueFeatures : [],
    pricing: c.pricing ? {
      model: c.pricing.model || 'N/A',
      tiers: Array.isArray(c.pricing.tiers) ? c.pricing.tiers.map((t: any) => ({
        ...t,
        features: Array.isArray(t.features) ? t.features : (typeof t.features === 'string' ? t.features.split(',').map((s: string) => s.trim()) : []),
      })) : [],
    } : undefined,
  }));

  const marketOverview = r.marketOverview || {};
  const pricingComparison = r.pricingComparison || {};
  const positioningMap = r.positioningMap || { xAxis: '', yAxis: '', positions: [], gaps: [] };
  const swotAnalysis = r.swotAnalysis || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  const stratRec = r.strategicRecommendations || {};

  // Normalize opportunityEngineering - exploitationPlan can be strings or objects
  const opportunityEngineering = Array.isArray(r.opportunityEngineering)
    ? r.opportunityEngineering.map((opp: any) => ({
        ...opp,
        exploitationPlan: Array.isArray(opp.exploitationPlan)
          ? opp.exploitationPlan.map((step: any) =>
              typeof step === 'string' ? { action: step } : step
            )
          : [],
      }))
    : [];

  // Build differentiationOpportunities from topDifferentiationStrategies if missing
  const diffOpps = Array.isArray(stratRec.differentiationOpportunities)
    ? stratRec.differentiationOpportunities
    : Array.isArray(stratRec.topDifferentiationStrategies)
      ? stratRec.topDifferentiationStrategies.map((s: any) => ({
          opportunity: s.strategy || s.opportunity || '',
          reasoning: s.reasoning || '',
          difficulty: s.ease || 'Medium',
          impact: s.roi || 'Medium',
        }))
      : [];

  return {
    reportType: r.reportType || 'company',
    targetCompany: r.targetCompany,
    industryTarget: r.industryTarget,
    executiveSummary: r.executiveSummary || '',
    marketOverview: {
      industryName: marketOverview.industryName || 'N/A',
      marketSize: marketOverview.marketSize || 'N/A',
      growthRate: marketOverview.growthRate || 'N/A',
      keyTrends: Array.isArray(marketOverview.keyTrends) ? marketOverview.keyTrends : [],
      marketDrivers: marketOverview.marketDrivers || '',
      threatFactors: marketOverview.threatFactors || '',
      regulatoryConsiderations: marketOverview.regulatoryConsiderations,
    },
    competitors,
    vulnerabilityAudit: Array.isArray(r.vulnerabilityAudit) ? r.vulnerabilityAudit : [],
    opportunityEngineering,
    pricingComparison: {
      summary: pricingComparison.summary || '',
      lowestPrice: pricingComparison.lowestPrice || 'N/A',
      highestPrice: pricingComparison.highestPrice || 'N/A',
      averagePrice: pricingComparison.averagePrice || 'N/A',
      pricingTrends: pricingComparison.pricingTrends || '',
      priceGaps: pricingComparison.priceGaps,
      pricingModelsBreakdown: pricingComparison.pricingModelsBreakdown,
    },
    positioningMap: {
      xAxis: positioningMap.xAxis || 'Price',
      yAxis: positioningMap.yAxis || 'Quality',
      positions: Array.isArray(positioningMap.positions) ? positioningMap.positions : [],
      gaps: Array.isArray(positioningMap.gaps) ? positioningMap.gaps : [],
    },
    swotAnalysis: {
      strengths: Array.isArray(swotAnalysis.strengths) ? swotAnalysis.strengths : [],
      weaknesses: Array.isArray(swotAnalysis.weaknesses) ? swotAnalysis.weaknesses : [],
      opportunities: Array.isArray(swotAnalysis.opportunities) ? swotAnalysis.opportunities : [],
      threats: Array.isArray(swotAnalysis.threats) ? swotAnalysis.threats : [],
    },
    tacticalRoadmap: r.tacticalRoadmap || undefined,
    strategicRecommendations: {
      differentiationOpportunities: diffOpps,
      topDifferentiationStrategies: Array.isArray(stratRec.topDifferentiationStrategies) ? stratRec.topDifferentiationStrategies : [],
      pricingStrategy: stratRec.pricingStrategy,
      recommendedPricePoints: stratRec.recommendedPricePoints,
      positioningStatement: stratRec.positioningStatement,
      buildFirst: Array.isArray(stratRec.buildFirst) ? stratRec.buildFirst : [],
      avoid: Array.isArray(stratRec.avoid) ? stratRec.avoid : [],
      goToMarketStrategy: stratRec.goToMarketStrategy,
      marketingAngles: Array.isArray(stratRec.marketingAngles) ? stratRec.marketingAngles : [],
      quickWins: Array.isArray(stratRec.quickWins) ? stratRec.quickWins : [],
    },
    disclaimer: r.disclaimer,
    generatedAt: r.generatedAt,
  };
}

const ReportPreview = ({ data, onDownloadPDF }: { data: ReportData; onDownloadPDF: () => void }) => {
  const reportTitle =
    data.reportType === 'company'
      ? data.targetCompany?.name || 'Competitor Analysis'
      : data.industryTarget?.category || 'Industry Analysis';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold mb-2" style={{ color: DARK }}>
          Competitor Spy Report
        </h1>
        <p className="text-2xl font-semibold" style={{ color: ACCENT }}>
          {reportTitle}
        </p>
        <p className="text-gray-500 mt-2">
          Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <button
          onClick={onDownloadPDF}
          className="mt-4 px-6 py-3 rounded-lg text-white font-semibold text-base transition-all hover:opacity-90 shadow-md"
          style={{ backgroundColor: ACCENT }}
        >
          Download Full Report (PDF)
        </button>
      </div>

      {/* Executive Summary */}
      {data.executiveSummary && (
        <section>
          <div
            className="p-6 rounded-lg border-l-4"
            style={{
              backgroundColor: '#f0f4f8',
              borderColor: ACCENT,
            }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: DARK }}>
              Executive Summary
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{data.executiveSummary}</p>
          </div>
        </section>
      )}

      {/* Market Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
          Market Overview
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Industry</p>
            <p className="font-semibold">{data.marketOverview.industryName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Market Size</p>
            <p className="font-semibold">{data.marketOverview.marketSize}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Growth Rate</p>
            <p className="font-semibold">{data.marketOverview.growthRate}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Key Trends</p>
            <p className="font-semibold">{data.marketOverview.keyTrends.length} identified</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2 text-gray-800">Key Trends</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {data.marketOverview.keyTrends.slice(0, 6).map((trend, idx) => {
              const trendText = renderTrendText(trend);
              const dataPoint = typeof trend === 'object' && trend.dataPoint ? ` (${trend.dataPoint})` : '';
              const implication =
                typeof trend === 'object' && trend.implication ? ` - ${trend.implication}` : '';

              return (
                <li key={idx}>
                  <span className="font-semibold">{trendText}</span>
                  {dataPoint && <span className="text-gray-600">{dataPoint}</span>}
                  {implication && <span className="text-gray-600 italic">{implication}</span>}
                </li>
              );
            })}
          </ul>
        </div>

        {data.marketOverview.regulatoryConsiderations && (
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4" style={{ borderColor: WARNING_AMBER }}>
            <h3 className="font-semibold mb-2 text-yellow-900">Regulatory Considerations</h3>
            <p className="text-gray-700">{data.marketOverview.regulatoryConsiderations}</p>
          </div>
        )}
      </section>

      {/* Competitors Summary - Grouped by Category */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
          Competitors
        </h2>

        {['Direct', 'Indirect', 'Emerging'].map((category) => {
          const competitorsInCategory = data.competitors.filter((c) => (c.category || 'Direct') === category);
          if (competitorsInCategory.length === 0) return null;

          return (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-bold mb-4 px-4 py-2 rounded" style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}>
                {category} Competitors
              </h3>
              <div className="space-y-4">
                {competitorsInCategory.map((comp, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{comp.name}</h3>
                        <a
                          href={comp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          {comp.url}
                        </a>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded"
                          style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}
                        >
                          {comp.marketPosition}
                        </span>
                        {comp.reviewRating && (
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                            Rating: {comp.reviewRating}/5
                          </span>
                        )}
                      </div>
                    </div>

                    {comp.biggestVulnerability && (
                      <div
                        className="mb-3 p-3 rounded border-l-4"
                        style={{ backgroundColor: '#ffe6e6', borderColor: DANGER_RED }}
                      >
                        <p className="text-xs font-bold text-red-900">BIGGEST VULNERABILITY</p>
                        <p className="text-sm text-red-800">{comp.biggestVulnerability}</p>
                      </div>
                    )}

                    <p className="text-gray-700 text-sm mb-3">{comp.description}</p>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <p className="font-semibold text-gray-600">Target Customer</p>
                        <p className="text-gray-700">{comp.targetCustomer}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Sentiment</p>
                        <p className="text-gray-700">{comp.customerSentiment}</p>
                      </div>
                      {comp.fundingRaised && (
                        <div>
                          <p className="font-semibold text-gray-600">Funding</p>
                          <p className="text-gray-700">{comp.fundingRaised}</p>
                        </div>
                      )}
                      {comp.estimatedSize && (
                        <div>
                          <p className="font-semibold text-gray-600">Size</p>
                          <p className="text-gray-700">{comp.estimatedSize}</p>
                        </div>
                      )}
                    </div>

                    {comp.strengths.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="font-semibold text-green-700 text-sm mb-2">Strengths ({comp.strengths.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {comp.strengths.slice(0, 6).map((s, i) => (
                            <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {renderStrengthText(s)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {comp.weaknesses.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="font-semibold text-red-700 text-sm mb-2">Weaknesses ({comp.weaknesses.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {comp.weaknesses.slice(0, 8).map((w, i) => (
                            <span key={i} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              {renderWeaknessText(w)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Vulnerability Audit */}
      {data.vulnerabilityAudit && data.vulnerabilityAudit.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: DANGER_RED }}>
            Vulnerability Audit
          </h2>
          <div className="space-y-4">
            {data.vulnerabilityAudit.map((audit, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <div className="bg-red-50 p-4 border-b-2" style={{ borderColor: DANGER_RED }}>
                  <h3 className="font-bold text-lg" style={{ color: DARK }}>
                    {audit.competitorName}
                  </h3>
                  <p className="text-sm text-red-800 font-semibold mt-1">Biggest Weakness: {audit.biggestWeakness}</p>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase">Feature Gaps</p>
                    <p className="text-sm text-gray-700">{audit.featureGaps}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase">Pricing Vulnerability</p>
                    <p className="text-sm text-gray-700">{audit.pricingVulnerability}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase">Customer Friction</p>
                    <p className="text-sm text-gray-700">{audit.customerFriction}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase">Positioning Gap</p>
                    <p className="text-sm text-gray-700">{audit.positioningGap}</p>
                  </div>
                  {audit.techDebt && (
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase">Tech Debt</p>
                      <p className="text-sm text-gray-700">{audit.techDebt}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Opportunity Engineering */}
      {data.opportunityEngineering && data.opportunityEngineering.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: SUCCESS_GREEN }}>
            Opportunity Engineering
          </h2>
          <p className="text-gray-600 mb-6">
            Concrete opportunities to exploit competitor gaps and capture market share
          </p>
          <div className="space-y-6">
            {data.opportunityEngineering.map((opp, idx) => (
              <div
                key={idx}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                style={{ borderColor: SUCCESS_GREEN, borderWidth: '2px' }}
              >
                <div
                  className="p-4"
                  style={{
                    backgroundColor: SUCCESS_GREEN,
                    color: 'white',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{opp.title}</h3>
                      {opp.gapDescription && <p className="text-sm mt-1 opacity-90">{opp.gapDescription}</p>}
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-white" style={{ color: SUCCESS_GREEN }}>
                        {opp.difficulty}
                      </span>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-white" style={{ color: SUCCESS_GREEN }}>
                        {opp.timeline}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {opp.evidence && (
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1">Evidence</p>
                      <p className="text-sm text-gray-700">{opp.evidence}</p>
                    </div>
                  )}

                  {opp.strategicRationale && (
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1">Strategic Rationale</p>
                      <p className="text-sm text-gray-700">{opp.strategicRationale}</p>
                    </div>
                  )}

                  {opp.exploitationPlan && opp.exploitationPlan.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase mb-2">Exploitation Plan</p>
                      <ol className="list-decimal list-inside space-y-1">
                        {opp.exploitationPlan.map((plan, pIdx) => (
                          <li key={pIdx} className="text-sm text-gray-700">
                            <span className="font-semibold">{plan.action}</span>
                            {plan.details && <span className="text-gray-600"> - {plan.details}</span>}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {(opp.estimatedImpact || opp.impactReasoning) && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs font-bold text-blue-900 uppercase mb-1">Impact</p>
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">{opp.estimatedImpact}</span>
                        {opp.impactReasoning && <span> - {opp.impactReasoning}</span>}
                      </p>
                    </div>
                  )}

                  {(opp.risks || opp.mitigation) && (
                    <div className="bg-yellow-50 p-3 rounded border-l-4" style={{ borderColor: WARNING_AMBER }}>
                      <p className="text-xs font-bold text-yellow-900 uppercase mb-1">Risks & Mitigation</p>
                      {opp.risks && <p className="text-sm text-yellow-800">Risk: {opp.risks}</p>}
                      {opp.mitigation && (
                        <p className="text-sm text-yellow-800 mt-1">Mitigation: {opp.mitigation}</p>
                      )}
                    </div>
                  )}

                  {opp.differentiation && (
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-xs font-bold text-purple-900 uppercase mb-1">Differentiation</p>
                      <p className="text-sm text-purple-800">{opp.differentiation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pricing Comparison */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
          Pricing Comparison
        </h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Lowest</p>
            <p className="font-bold text-lg">{data.pricingComparison.lowestPrice}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Highest</p>
            <p className="font-bold text-lg">{data.pricingComparison.highestPrice}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Average</p>
            <p className="font-bold text-lg">{data.pricingComparison.averagePrice}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Trend</p>
            <p className="font-semibold">{data.pricingComparison.pricingTrends}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{data.pricingComparison.summary}</p>
        {data.pricingComparison.priceGaps && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Price Gaps</p>
            <p className="text-sm text-blue-800">{data.pricingComparison.priceGaps}</p>
          </div>
        )}
        {data.pricingComparison.pricingModelsBreakdown && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-purple-900 mb-1">Pricing Models Breakdown</p>
            <p className="text-sm text-purple-800">{data.pricingComparison.pricingModelsBreakdown}</p>
          </div>
        )}
      </section>

      {/* 90-Day Tactical Roadmap */}
      {data.tacticalRoadmap && (
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
            90-Day Tactical Roadmap
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {data.tacticalRoadmap.week1to2 && data.tacticalRoadmap.week1to2.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-3">
                  <h3 className="font-bold">Week 1-2: Foundation</h3>
                </div>
                <div className="p-4 space-y-3">
                  {data.tacticalRoadmap.week1to2.map((item, idx) => (
                    <div key={idx} className="border-l-4 border-blue-400 pl-4">
                      <p className="font-semibold text-gray-800">{item.action}</p>
                      {item.details && <p className="text-sm text-gray-600">{item.details}</p>}
                      {item.expectedOutcome && (
                        <p className="text-sm text-blue-700 mt-1">Expected outcome: {item.expectedOutcome}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.tacticalRoadmap.week3to4 && data.tacticalRoadmap.week3to4.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-green-600 text-white p-3">
                  <h3 className="font-bold">Week 3-4: Acceleration</h3>
                </div>
                <div className="p-4 space-y-3">
                  {data.tacticalRoadmap.week3to4.map((item, idx) => (
                    <div key={idx} className="border-l-4 border-green-400 pl-4">
                      <p className="font-semibold text-gray-800">{item.action}</p>
                      {item.details && <p className="text-sm text-gray-600">{item.details}</p>}
                      {item.expectedOutcome && (
                        <p className="text-sm text-green-700 mt-1">Expected outcome: {item.expectedOutcome}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.tacticalRoadmap.month2 && data.tacticalRoadmap.month2.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-amber-600 text-white p-3">
                  <h3 className="font-bold">Month 2: Scaling</h3>
                </div>
                <div className="p-4 space-y-3">
                  {data.tacticalRoadmap.month2.map((item, idx) => (
                    <div key={idx} className="border-l-4 border-amber-400 pl-4">
                      <p className="font-semibold text-gray-800">{item.action}</p>
                      {item.details && <p className="text-sm text-gray-600">{item.details}</p>}
                      {item.expectedOutcome && (
                        <p className="text-sm text-amber-700 mt-1">Expected outcome: {item.expectedOutcome}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.tacticalRoadmap.month3 && data.tacticalRoadmap.month3.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-purple-600 text-white p-3">
                  <h3 className="font-bold">Month 3: Consolidation</h3>
                </div>
                <div className="p-4 space-y-3">
                  {data.tacticalRoadmap.month3.map((item, idx) => (
                    <div key={idx} className="border-l-4 border-purple-400 pl-4">
                      <p className="font-semibold text-gray-800">{item.action}</p>
                      {item.details && <p className="text-sm text-gray-600">{item.details}</p>}
                      {item.expectedOutcome && (
                        <p className="text-sm text-purple-700 mt-1">Expected outcome: {item.expectedOutcome}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SWOT */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
          SWOT Analysis
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border-l-4" style={{ borderColor: SUCCESS_GREEN }}>
            <h3 className="font-bold text-green-900 mb-2">Strengths</h3>
            <ul className="space-y-2 text-sm text-green-800">
              {data.swotAnalysis.strengths.slice(0, 5).map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 font-bold">+</span>
                  <div>
                    <p className="font-semibold">{renderSwotText(item)}</p>
                    {typeof item === 'object' && item.reasoning && (
                      <p className="text-xs text-green-700 mt-1">{item.reasoning}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4" style={{ borderColor: DANGER_RED }}>
            <h3 className="font-bold text-red-900 mb-2">Weaknesses</h3>
            <ul className="space-y-2 text-sm text-red-800">
              {data.swotAnalysis.weaknesses.slice(0, 5).map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 font-bold">-</span>
                  <div>
                    <p className="font-semibold">{renderSwotText(item)}</p>
                    {typeof item === 'object' && item.reasoning && (
                      <p className="text-xs text-red-700 mt-1">{item.reasoning}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border-l-4" style={{ borderColor: WARNING_AMBER }}>
            <h3 className="font-bold text-amber-900 mb-2">Opportunities</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              {data.swotAnalysis.opportunities.slice(0, 5).map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">→</span>
                  <div>
                    <p className="font-semibold">{renderSwotText(item)}</p>
                    {typeof item === 'object' && item.reasoning && (
                      <p className="text-xs text-amber-700 mt-1">{item.reasoning}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border-l-4" style={{ borderColor: '#d35400' }}>
            <h3 className="font-bold text-orange-900 mb-2">Threats</h3>
            <ul className="space-y-2 text-sm text-orange-800">
              {data.swotAnalysis.threats.slice(0, 5).map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 font-bold">!</span>
                  <div>
                    <p className="font-semibold">{renderSwotText(item)}</p>
                    {typeof item === 'object' && item.reasoning && (
                      <p className="text-xs text-orange-700 mt-1">{item.reasoning}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Positioning Map */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
          Market Positioning Map
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Dimensions: <span className="font-semibold">{data.positioningMap.xAxis}</span> (X-axis) vs{' '}
            <span className="font-semibold">{data.positioningMap.yAxis}</span> (Y-axis)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {data.positioningMap.positions.map((pos, idx) => (
              <div key={idx} className="bg-white p-3 rounded border">
                <p className="font-semibold text-sm">{pos.company}</p>
                <p className="text-xs text-gray-600">
                  Position: ({pos.x}, {pos.y})
                </p>
                <p className="text-xs text-gray-500">Quadrant: {pos.quadrant}</p>
              </div>
            ))}
          </div>
        </div>

        {data.positioningMap.gaps.length > 0 && (
          <div>
            <h3 className="font-bold mb-2 text-gray-800">Market Gaps & Opportunities</h3>
            <div className="space-y-2">
              {data.positioningMap.gaps.map((gap, idx) => {
                const gapText = renderGapText(gap);
                const whyExists = typeof gap === 'object' && gap.whyExists ? ` (Why: ${gap.whyExists})` : '';
                const opportunity = typeof gap === 'object' && gap.opportunity ? ` [Opportunity: ${gap.opportunity}]` : '';

                return (
                  <div key={idx} className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{gapText}</span>
                      {whyExists && <span className="text-gray-600">{whyExists}</span>}
                      {opportunity && <span className="text-blue-700 font-semibold">{opportunity}</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Strategic Recommendations */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
          Strategic Recommendations
        </h2>

        {data.strategicRecommendations.positioningStatement && (
          <div
            className="p-4 rounded-lg mb-6 border-l-4"
            style={{
              backgroundColor: '#f9f5f0',
              borderColor: ACCENT,
            }}
          >
            <p className="text-xs font-bold text-gray-600 uppercase mb-2">Positioning Statement</p>
            <p className="text-lg font-semibold" style={{ color: DARK }}>
              {data.strategicRecommendations.positioningStatement}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {data.strategicRecommendations.topDifferentiationStrategies &&
            data.strategicRecommendations.topDifferentiationStrategies.length > 0 && (
              <div>
                <h3 className="font-bold mb-3" style={{ color: ACCENT }}>
                  Top Differentiation Strategies
                </h3>
                <div className="space-y-3">
                  {data.strategicRecommendations.topDifferentiationStrategies.map((strat, idx) => (
                    <div key={idx} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="font-semibold text-gray-800">{strat.strategy}</p>
                        <div className="flex gap-2">
                          {strat.roi && (
                            <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">
                              ROI: {strat.roi}
                            </span>
                          )}
                          {strat.ease && (
                            <span className="text-xs font-bold px-2 py-1 rounded bg-purple-100 text-purple-800">
                              {strat.ease}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{strat.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {(data.strategicRecommendations.buildFirst || data.strategicRecommendations.avoid) && (
            <div className="grid grid-cols-2 gap-4">
              {data.strategicRecommendations.buildFirst && data.strategicRecommendations.buildFirst.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border-l-4" style={{ borderColor: SUCCESS_GREEN }}>
                  <h3 className="font-bold text-green-900 mb-2">Build First</h3>
                  <ul className="space-y-1 text-sm text-green-800">
                    {data.strategicRecommendations.buildFirst.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2 font-bold">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.strategicRecommendations.avoid && data.strategicRecommendations.avoid.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg border-l-4" style={{ borderColor: DANGER_RED }}>
                  <h3 className="font-bold text-red-900 mb-2">Avoid</h3>
                  <ul className="space-y-1 text-sm text-red-800">
                    {data.strategicRecommendations.avoid.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2 font-bold">x</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {data.strategicRecommendations.goToMarketStrategy && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-xs font-bold text-purple-900 uppercase mb-2">Go-To-Market Strategy</p>
              <p className="text-gray-700">{data.strategicRecommendations.goToMarketStrategy}</p>
            </div>
          )}

          {data.strategicRecommendations.marketingAngles && data.strategicRecommendations.marketingAngles.length > 0 && (
            <div>
              <h3 className="font-bold mb-3" style={{ color: ACCENT }}>
                Marketing Angles ({data.strategicRecommendations.marketingAngles.length})
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {data.strategicRecommendations.marketingAngles.map((angle, idx) => (
                  <div key={idx} className="flex items-start bg-gray-50 p-3 rounded">
                    <span className="mr-3 font-bold" style={{ color: ACCENT }}>
                      {idx + 1}.
                    </span>
                    <span className="text-gray-700">{angle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.strategicRecommendations.recommendedPricePoints && (
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4" style={{ borderColor: WARNING_AMBER }}>
              <p className="text-xs font-bold text-yellow-900 uppercase mb-2">Recommended Price Points</p>
              <p className="text-gray-700">{data.strategicRecommendations.recommendedPricePoints}</p>
            </div>
          )}

          {data.strategicRecommendations.differentiationOpportunities.length > 0 && (
            <div>
              <h3 className="font-bold mb-3" style={{ color: ACCENT }}>
                Quick Wins
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {data.strategicRecommendations.differentiationOpportunities.slice(0, 3).map((opp, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 font-bold" style={{ color: ACCENT }}>
                      {idx + 1}.
                    </span>
                    <div>
                      <span className="font-semibold">{opp.opportunity}</span>
                      {opp.reasoning && <p className="text-xs text-gray-600 mt-1">{opp.reasoning}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Download Button */}
      <div className="border-t pt-8">
        <button
          onClick={onDownloadPDF}
          className="w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          Download Full Report (PDF)
        </button>
        {data.disclaimer && <p className="text-xs text-gray-400 mt-3 text-center">{data.disclaimer}</p>}
      </div>

      {/* Review Request CTA */}
      <div className="border-t pt-8">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">⭐⭐⭐⭐⭐</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Did this report help you?</h3>
          <p className="text-gray-700 mb-4 max-w-xl mx-auto">
            We are a tiny bootstrapped team. A 30-second review on G2 or Trustpilot helps more business owners find us
            and tells us what to build next. Thank you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.g2.com/products/bizplan-genius/reviews/start"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              Leave a G2 Review
            </a>
            <a
              href="https://www.trustpilot.com/evaluate/bizplangenius.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Leave a Trustpilot Review
            </a>
            <a
              href="mailto:support@bizplangenius.com?subject=Feedback%20on%20my%20Competitor%20Spy%20Report"
              className="inline-block px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition"
            >
              Email Feedback
            </a>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">What to do next with your research</p>

          {/* Primary CTA: Business Plan */}
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <p className="text-xs font-bold text-brand-600 uppercase mb-1">Recommended</p>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Turn this research into a full business plan</h3>
                <p className="text-sm text-gray-600">Investor-ready plan with financials, strategy, and a roadmap built on this competitor data.</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href="/generate?tier=pro" className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition text-sm">Pro Plan - $49</a>
                <a href="/generate?tier=starter" className="px-6 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition text-sm">Starter - $29</a>
              </div>
            </div>
          </div>

          {/* Secondary CTAs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            <a href="/bundles" className="p-4 rounded-xl border border-accent-200 bg-accent-50 hover:border-accent-400 transition block">
              <p className="text-xs font-bold text-accent-600 uppercase mb-1">Best Value</p>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Launch Pack Bundle</h4>
              <p className="text-xs text-gray-500">Plan + website + pitch deck</p>
              <p className="text-sm font-extrabold text-accent-600 mt-2">$199</p>
            </a>
            <a href="/build-website" className="p-4 rounded-xl border border-accent-200 bg-accent-50/50 hover:border-accent-400 transition block">
              <p className="text-xs font-bold text-accent-600 uppercase mb-1">Build</p>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Website Builder</h4>
              <p className="text-xs text-gray-500">Custom site from plan</p>
              <p className="text-sm font-extrabold text-accent-600 mt-2">From $99</p>
            </a>
            <a href="/pitch-deck" className="p-4 rounded-xl border border-purple-200 bg-purple-50 hover:border-purple-400 transition block">
              <p className="text-xs font-bold text-purple-600 uppercase mb-1">Fundraise</p>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Pitch Deck</h4>
              <p className="text-xs text-gray-500">12 investor slides</p>
              <p className="text-sm font-extrabold text-purple-600 mt-2">$39</p>
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a href="/brand-kit" className="p-3 rounded-xl border border-orange-200 bg-orange-50 hover:border-orange-400 transition block text-center">
              <p className="font-bold text-gray-900 text-sm">Brand Kit</p>
              <p className="text-xs text-orange-600 font-bold">$29</p>
            </a>
            <a href="/social-pack" className="p-3 rounded-xl border border-pink-200 bg-pink-50 hover:border-pink-400 transition block text-center">
              <p className="font-bold text-gray-900 text-sm">Social Pack</p>
              <p className="text-xs text-pink-600 font-bold">$29</p>
            </a>
            <a href="/investor-emails" className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 hover:border-indigo-400 transition block text-center">
              <p className="font-bold text-gray-900 text-sm">Investor Emails</p>
              <p className="text-xs text-indigo-600 font-bold">$19</p>
            </a>
            <a href="/business-name-generator" className="p-3 rounded-xl border border-green-200 bg-green-50 hover:border-green-400 transition block text-center">
              <p className="font-bold text-gray-900 text-sm">Name Generator</p>
              <p className="text-xs text-green-600 font-bold">Free</p>
            </a>
          </div>

          {/* Subscription upsell */}
          <div className="mt-4 p-4 rounded-xl border-2 border-accent-200 bg-accent-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 text-sm">Want this report updated every month?</p>
                <p className="text-xs text-gray-500">Get alerts when competitors change pricing, launch features, or enter your market.</p>
              </div>
              <a href="/monitoring" className="px-4 py-2 bg-accent-600 text-white text-sm font-bold rounded-lg hover:bg-accent-700 transition flex-shrink-0 ml-4">
                $15/mo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ProgressBar({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);
  const [statusText, setStatusText] = useState('Connecting to intelligence network...');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const secs = Math.floor((now - startTime) / 1000);
      setElapsed(secs);

      if (secs < 10) setStatusText('Searching competitor websites and databases...');
      else if (secs < 25) setStatusText('Analyzing pricing pages and review sites...');
      else if (secs < 45) setStatusText('Mining customer reviews from G2, Capterra, Reddit...');
      else if (secs < 70) setStatusText('Identifying vulnerabilities and market gaps...');
      else if (secs < 100) setStatusText('Engineering opportunities and building roadmap...');
      else if (secs < 130) setStatusText('Structuring findings into your report...');
      else setStatusText('Finalizing report (this can take up to 3 minutes)...');
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Progress fills to ~90% over 150 seconds, never reaches 100% until done
  const progress = Math.min(90, (elapsed / 150) * 90);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-700">{statusText}</span>
          <span className="text-gray-500">{timeStr}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${ACCENT}, ${SUCCESS_GREEN})`,
            }}
          />
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: ACCENT, animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: ACCENT, animationDelay: '200ms' }} />
        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: ACCENT, animationDelay: '400ms' }} />
      </div>

      {/* Reassurance message */}
      <p className="text-center text-sm text-gray-500">
        Our AI is conducting deep research across the web. Premium reports take 1-3 minutes to generate.
        <br />
        <span className="font-semibold">Please don't close or refresh this page.</span>
      </p>
    </div>
  );
}

function SpySuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    if (!sessionId) {
      setError('Missing session ID');
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/spy-fulfill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to generate report');
        }

        const { report } = await response.json();
        setReportData(normalizeReport(report));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [sessionId]);

  const handleDownloadPDF = async () => {
    if (!reportData) return;

    try {
      await loadPdfMake();
      await generatePDF(reportData);
    } catch (err) {
      setError('Failed to generate PDF');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="text-2xl font-bold text-gradient">BizPlan Genius</div>
          </Link>
          <div className="text-lg font-semibold text-gray-700">Competitor Spy</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading && !error ? (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2" style={{ color: DARK }}>
                Generating Your Intelligence Report
              </h1>
              <p className="text-gray-600">
                Our AI is conducting deep competitive research across the web
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <ProgressBar startTime={startTime} />
            </div>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-red-900 mb-2">Error Generating Report</h2>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : reportData ? (
          <>
            <ReportPreview data={reportData} onDownloadPDF={handleDownloadPDF} />
            <div className="text-center py-6 text-xs text-gray-400">
              <a href={`/dashboard?session_id=${sessionId}`} className="text-brand-600 hover:text-brand-700 underline text-sm">
                View your full toolkit &amp; available products
              </a>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default function SpySuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpySuccessContent />
    </Suspense>
  );
}
