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

interface Competitor {
  name: string;
  url: string;
  description: string;
  founded?: number;
  estimatedSize?: string;
  pricing?: {
    model: string;
    tiers: PricingTier[];
  };
  targetCustomer: string;
  strengths: string[];
  weaknesses: string[];
  uniqueFeatures: string[];
  customerSentiment: string;
  marketPosition: string;
}

interface PricingComparison {
  summary: string;
  lowestPrice: string | number;
  highestPrice: string | number;
  averagePrice: string | number;
  pricingTrends: string;
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
  gaps: string[];
}

interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface DifferentiationOpportunity {
  opportunity: string;
  reasoning: string;
  difficulty: string;
  impact: string;
}

interface StrategicRecommendations {
  differentiationOpportunities: DifferentiationOpportunity[];
  pricingStrategy: string;
  marketingAngles: string[];
  quickWins: string[];
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
  marketOverview: {
    industryName: string;
    marketSize: string;
    growthRate: string;
    keyTrends: string[];
    marketDrivers: string;
    threatFactors: string;
  };
  competitors: Competitor[];
  pricingComparison: PricingComparison;
  positioningMap: PositioningMap;
  swotAnalysis: SwotAnalysis;
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

function generatePDF(data: ReportData): void {
  const pdfMake = (window as any).pdfMake;
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
      font: 'Helvetica',
      size: 11,
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
      // Cover Page
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
        text: `Prepared on ${dateStr}`,
        fontSize: 12,
        alignment: 'center',
        color: TEXT_LIGHT,
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

      // Market Overview
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
        ul: data.marketOverview.keyTrends,
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

      // Competitor Profiles
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
            ul: comp.strengths.slice(0, 3),
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
            ul: comp.weaknesses.slice(0, 3),
            margin: [20, 0, 0, 8],
            color: DANGER_RED,
          });
        }

        if (idx < data.competitors.length - 1) {
          content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: LINE_LIGHT }], margin: [0, 10, 0, 10] });
        }

        return content;
      }),
      { text: '', pageBreak: 'after' },

      // Pricing Comparison
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

      // Market Positioning
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
            ul: data.positioningMap.gaps,
            margin: [20, 0, 0, 20],
          }
        : null,
      { text: '', pageBreak: 'after' },

      // SWOT Analysis
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
                ul: data.swotAnalysis.strengths,
                color: SUCCESS_GREEN,
                margin: [0, 0, 0, 20],
              },
              {
                text: 'Weaknesses',
                fontSize: 12,
                bold: true,
                color: DANGER_RED,
                margin: [0, 0, 0, 6],
              },
              {
                ul: data.swotAnalysis.weaknesses,
                color: DANGER_RED,
              },
            ],
          },
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
                ul: data.swotAnalysis.opportunities,
                color: WARNING_AMBER,
                margin: [0, 0, 0, 20],
              },
              {
                text: 'Threats',
                fontSize: 12,
                bold: true,
                color: DANGER_RED,
                margin: [0, 0, 0, 6],
              },
              {
                ul: data.swotAnalysis.threats,
                color: DANGER_RED,
              },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },
      { text: '', pageBreak: 'after' },

      // Strategic Recommendations
      { text: 'Strategic Recommendations', style: 'sectionTitle' },
      {
        text: 'Differentiation Opportunities',
        fontSize: 12,
        bold: true,
        color: ACCENT,
        margin: [0, 10, 0, 8],
      },
      ...data.strategicRecommendations.differentiationOpportunities.map(
        (opp) => ({
          stack: [
            {
              text: opp.opportunity,
              bold: true,
              color: ACCENT,
              margin: [0, 0, 0, 4],
            },
            { text: `Reasoning: ${opp.reasoning}`, style: 'smallText', margin: [0, 0, 0, 2] },
            { text: `Difficulty: ${opp.difficulty}`, style: 'smallText', margin: [0, 0, 0, 2] },
            { text: `Impact: ${opp.impact}`, style: 'smallText', margin: [0, 0, 0, 8] },
          ],
          margin: [0, 0, 0, 8],
        })
      ),
      {
        text: 'Pricing Strategy',
        fontSize: 12,
        bold: true,
        color: ACCENT,
        margin: [0, 12, 0, 6],
      },
      {
        text: data.strategicRecommendations.pricingStrategy,
        margin: [0, 0, 0, 12],
      },
      {
        text: 'Marketing Angles',
        fontSize: 12,
        bold: true,
        color: ACCENT,
        margin: [0, 0, 0, 6],
      },
      {
        ul: data.strategicRecommendations.marketingAngles,
        margin: [20, 0, 0, 12],
      },
      {
        text: 'Quick Wins',
        fontSize: 12,
        bold: true,
        color: ACCENT,
        margin: [0, 0, 0, 6],
      },
      {
        ul: data.strategicRecommendations.quickWins,
        margin: [20, 0, 0, 0],
      },

      // Disclaimer
      { text: '', pageBreak: 'after' },
      {
        text: 'Disclaimer',
        style: 'sectionTitle',
      },
      {
        text: data.disclaimer || 'This report reflects publicly available information gathered via web research. We recommend verifying pricing and company details directly on competitor websites before making strategic decisions.',
        style: 'smallText',
        margin: [0, 8, 0, 20],
      },
      {
        text: `Report generated on ${dateStr} by BizPlan Genius Competitor Spy.`,
        style: 'smallText',
        color: TEXT_MUTED,
        margin: [0, 0, 0, 10],
      },
      {
        text: 'Need a full business plan? Visit bizplangenius.com',
        fontSize: 11,
        bold: true,
        color: ACCENT,
        alignment: 'center',
        margin: [0, 20, 0, 0],
      },
    ],
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: 'center',
      style: 'smallText',
      margin: [0, 10, 0, 0],
    }),
  };

  pdfMake.createPdf(docDefinition).download(`competitor-spy-report-${Date.now()}.pdf`);
}

const ProgressSteps = ({ step }: { step: number }) => {
  const steps = [
    'Researching competitors',
    'Analyzing pricing',
    'Building your report',
  ];

  return (
    <div className="space-y-6">
      {steps.map((s, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              idx < step ? 'bg-green-600' : idx === step ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'
            }`}
          >
            {idx < step ? '\u2713' : idx + 1}
          </div>
          <span
            className={`text-lg ${
              idx <= step ? 'text-gray-800 font-medium' : 'text-gray-400'
            }`}
          >
            {s}
          </span>
        </div>
      ))}
    </div>
  );
};

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
      </div>

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
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800">Key Trends</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {data.marketOverview.keyTrends.slice(0, 5).map((trend, idx) => (
              <li key={idx}>{trend}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Competitors Summary */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
          Competitors
        </h2>
        <div className="space-y-4">
          {data.competitors.map((comp, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{comp.name}</h3>
                  <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                    {comp.url}
                  </a>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}>
                  {comp.marketPosition}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-3">{comp.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-600">Target Customer</p>
                  <p className="text-gray-700">{comp.targetCustomer}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Sentiment</p>
                  <p className="text-gray-700">{comp.customerSentiment}</p>
                </div>
              </div>
              {comp.strengths.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="font-semibold text-green-700 text-sm mb-1">Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {comp.strengths.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

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
        <p className="text-gray-700">{data.pricingComparison.summary}</p>
      </section>

      {/* SWOT */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
          SWOT Analysis
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border-l-4" style={{ borderColor: SUCCESS_GREEN }}>
            <h3 className="font-bold text-green-900 mb-2">Strengths</h3>
            <ul className="space-y-1 text-sm text-green-800">
              {data.swotAnalysis.strengths.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4" style={{ borderColor: DANGER_RED }}>
            <h3 className="font-bold text-red-900 mb-2">Weaknesses</h3>
            <ul className="space-y-1 text-sm text-red-800">
              {data.swotAnalysis.weaknesses.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border-l-4" style={{ borderColor: WARNING_AMBER }}>
            <h3 className="font-bold text-amber-900 mb-2">Opportunities</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              {data.swotAnalysis.opportunities.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">â</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border-l-4" style={{ borderColor: WARNING_AMBER }}>
            <h3 className="font-bold text-orange-900 mb-2">Threats</h3>
            <ul className="space-y-1 text-sm text-orange-800">
              {data.swotAnalysis.threats.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Strategic Recommendations */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
          Strategic Recommendations
        </h2>
        <div className="space-y-6">
          {data.strategicRecommendations.differentiationOpportunities.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ color: ACCENT }}>
                Quick Wins
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {data.strategicRecommendations.differentiationOpportunities
                  .slice(0, 3)
                  .map((opp, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 font-bold" style={{ color: ACCENT }}>
                        {idx + 1}.
                      </span>
                      <span>{opp.opportunity}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {data.strategicRecommendations.marketingAngles.length > 0 && (
            <div>
              <h3 className="font-bold mb-2" style={{ color: ACCENT }}>
                Marketing Angles
              </h3>
              <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                {data.strategicRecommendations.marketingAngles.slice(0, 4).map((angle, idx) => (
                  <li key={idx}>{angle}</li>
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
        {data.disclaimer && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            {data.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
};

function SpySuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);

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

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgressStep((prev) => (prev < 2 ? prev + 1 : prev));
        }, 1500);

        const response = await fetch('/api/spy-fulfill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to generate report');
        }

        const { report } = await response.json();
        setReportData(report as ReportData);
        setProgressStep(3);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProgressStep(0);
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
      generatePDF(reportData);
    } catch (err) {
      setError('Failed to generate PDF');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="text-2xl font-bold text-gradient">BizPlan Genius</div>
          </Link>
          <div className="text-lg font-semibold text-gray-700">Competitor Spy</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading && !error ? (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: DARK }}>
                Generating Your Report
              </h1>
              <p className="text-gray-600">
                We're analyzing competitors and building your comprehensive report...
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <ProgressSteps step={progressStep} />
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
          <div className="space-y-12">
            <ReportPreview data={reportData} onDownloadPDF={handleDownloadPDF} />

            {/* Cross-sell CTA */}
            <section className="border-t pt-12">
              <div
                className="rounded-lg p-8 text-white"
                style={{ backgroundColor: ACCENT }}
              >
                <h2 className="text-3xl font-bold mb-2">Want a Full Business Plan?</h2>
                <p className="text-lg mb-6 opacity-95">
                  Get a complete business plan for your startup with BizPlan Genius. Use code SPYUPSELL for $10 off.
                </p>
                <Link
                  href="/generate?coupon=SPYUPSELL"
                  className="inline-block px-8 py-3 bg-white text-lg font-semibold rounded-lg hover:bg-gray-100 transition"
                  style={{ color: ACCENT }}
                >
                  Get BizPlan Genius
                </Link>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}


export default function SpySuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-gray-500 text-lg">Loading...</p></div>}>
      <SpySuccessContent />
    </Suspense>
  );
}
