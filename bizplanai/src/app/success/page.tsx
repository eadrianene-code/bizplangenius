'use client';

import { useEffect, useState, useRef } from 'react';

interface BusinessPlan {
  executiveSummary: any;
  competitorAnalysis: any;
  marketAnalysis: any;
  marketingStrategy: any;
  financialProjections: any;
  operationsPlan: any;
  riskAnalysis: any;
}

/* ================================================================
   PDF GENERATION — pdfmake (native vector PDF, not screenshots)
   ================================================================ */

function loadPdfMake(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfMake) { resolve(); return; }
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

/* ---- Color palette — professional navy/blue theme ---- */

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

/* ---- PDF helper functions ---- */

function sectionHeading(num: number, title: string): any[] {
  return [
    { text: '', margin: [0, 6, 0, 0], ...(num > 1 ? { pageBreak: 'before' } : {}) },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, lineColor: ACCENT }], margin: [0, 0, 0, 5] },
    { text: `${num}.  ${title.toUpperCase()}`, fontSize: 13, bold: true, color: ACCENT, characterSpacing: 0.8, margin: [0, 0, 0, 10], headlineLevel: 1 },
  ];
}

function subHeading(title: string): any {
  return { text: title, bold: true, fontSize: 11, color: ACCENT, margin: [0, 10, 0, 5], headlineLevel: 2 };
}

function bodyText(text: string, opts?: any): any {
  return { text: text || '\u2014', fontSize: 10, color: TEXT, lineHeight: 1.55, margin: [0, 0, 0, 8], ...opts };
}

function labelValue(label: string, value: string): any {
  return { text: [{ text: `${label}: `, bold: true, color: TEXT }, { text: value || '\u2014', color: TEXT_LIGHT }], fontSize: 10, lineHeight: 1.5, margin: [0, 2, 0, 2] };
}

function twoCol(l1: string, v1: string, l2: string, v2: string): any {
  return {
    columns: [
      { width: '*', stack: [
        { text: l1.toUpperCase(), bold: true, fontSize: 8, color: ACCENT, characterSpacing: 0.5, margin: [0, 0, 0, 3] },
        { text: v1 || '\u2014', fontSize: 10, color: TEXT, lineHeight: 1.5 },
      ] },
      { width: 20, text: '' },
      { width: '*', stack: [
        { text: l2.toUpperCase(), bold: true, fontSize: 8, color: ACCENT, characterSpacing: 0.5, margin: [0, 0, 0, 3] },
        { text: v2 || '\u2014', fontSize: 10, color: TEXT, lineHeight: 1.5 },
      ] },
    ],
    margin: [0, 8, 0, 8],
  };
}

function calloutBox(label: string, value: string): any {
  return {
    margin: [0, 6, 0, 6],
    table: { widths: ['*'], body: [[{ stack: [
      { text: label.toUpperCase(), bold: true, fontSize: 8, color: ACCENT, characterSpacing: 0.5, margin: [0, 0, 0, 3] },
      { text: value || '\u2014', fontSize: 10, color: TEXT, lineHeight: 1.5 },
    ] }]] },
    layout: {
      hLineWidth: () => 0, vLineWidth: (i: number) => i === 0 ? 3 : 0,
      vLineColor: () => ACCENT,
      paddingLeft: () => 12, paddingRight: () => 12, paddingTop: () => 8, paddingBottom: () => 8,
      fillColor: () => '#f8f9fa',
    },
  };
}

function bulletList(items: string[], opts?: { color?: string; iconColor?: string }): any[] {
  const color = opts?.color || TEXT_LIGHT;
  const iconColor = opts?.iconColor || ACCENT;
  return items.map(item => ({
    columns: [
      { text: '\u2022', width: 12, fontSize: 10, color: iconColor, alignment: 'center' },
      { text: item, fontSize: 10, color, lineHeight: 1.45, width: '*' },
    ],
    margin: [4, 1, 0, 1],
    columnGap: 4,
  }));
}

/* parse markdown-style **bold** in text and return pdfmake text array */
function parseMarkdownText(raw: string): any {
  if (!raw) return { text: '\u2014', fontSize: 10, color: TEXT_LIGHT, lineHeight: 1.5 };
  const parts: any[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    if (match.index > last) parts.push({ text: raw.slice(last, match.index), color: TEXT_LIGHT });
    parts.push({ text: match[1], bold: true, color: TEXT });
    last = regex.lastIndex;
  }
  if (last < raw.length) parts.push({ text: raw.slice(last), color: TEXT_LIGHT });
  return { text: parts.length ? parts : [{ text: raw, color: TEXT_LIGHT }], fontSize: 10, lineHeight: 1.5 };
}

function competitorEntry(c: any): any {
  const rows: any[] = [];
  rows.push({ text: c.name || '', bold: true, fontSize: 11, color: DARK, margin: [0, 6, 0, 2] });
  if (c.pricing) rows.push({ text: c.pricing, fontSize: 9, color: TEXT_MUTED, italics: true, margin: [0, 0, 0, 3] });
  if (c.description) rows.push({ text: c.description, fontSize: 10, color: TEXT_LIGHT, lineHeight: 1.4, margin: [0, 0, 0, 4] });
  const items: any[] = [];
  (c.strengths || []).forEach((s: string) => items.push({ text: [{ text: '+  ', color: SUCCESS_GREEN, bold: true }, { text: s, color: TEXT }], fontSize: 9, margin: [4, 1, 0, 1] }));
  (c.weaknesses || []).forEach((w: string) => items.push({ text: [{ text: '-  ', color: DANGER_RED, bold: true }, { text: w, color: TEXT_LIGHT }], fontSize: 9, margin: [4, 1, 0, 1] }));
  if (items.length) rows.push({ stack: items, margin: [0, 2, 0, 2] });
  rows.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.3, lineColor: LINE_LIGHT }], margin: [0, 4, 0, 0] });
  return { stack: rows, unbreakable: true };
}

function riskRow(r: any): any[] {
  const color = r.likelihood === 'High' ? DANGER_RED : r.likelihood === 'Medium' ? WARNING_AMBER : SUCCESS_GREEN;
  return [
    { text: r.risk || '', fontSize: 9, color: TEXT },
    { text: r.likelihood || '', fontSize: 9, color, bold: true, alignment: 'center' },
    { text: r.mitigation || '', fontSize: 9, color: TEXT_LIGHT, lineHeight: 1.3 },
  ];
}

function channelRow(ch: any): any[] {
  const color = ch.priority === 'High' ? DANGER_RED : ch.priority === 'Medium' ? WARNING_AMBER : TEXT_MUTED;
  return [
    { text: ch.channel || '', fontSize: 9, color: TEXT, bold: true },
    { text: ch.priority || '', fontSize: 9, color, bold: true, alignment: 'center' },
    { stack: [
      { text: ch.strategy || '', fontSize: 9, color: TEXT_LIGHT, lineHeight: 1.3 },
      ch.estimatedCAC ? { text: `CAC: ${ch.estimatedCAC}`, fontSize: 8, color: TEXT_MUTED, margin: [0, 2, 0, 0] } : null,
    ].filter(Boolean) },
  ];
}

/* Standard table layout used throughout */
function cleanTableLayout(accentHeader?: boolean): any {
  return {
    hLineWidth: (i: number, node: any) => (i === 0 || i === 1 || i === node.table.body.length) ? 0.7 : 0.3,
    vLineWidth: () => 0,
    hLineColor: (i: number) => i <= 1 ? (accentHeader ? ACCENT : LINE) : LINE_LIGHT,
    paddingLeft: () => 8, paddingRight: () => 8, paddingTop: () => 5, paddingBottom: () => 5,
  };
}

/* ---- main document builder ---- */

function buildPDF(plan: BusinessPlan, businessName: string) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const content: any[] = [];

  /* ---------- COVER PAGE ---------- */
  content.push(
    { text: '\n\n\n\n\n\n\n\n\n', fontSize: 10 },
    { canvas: [{ type: 'line', x1: 140, y1: 0, x2: 375, y2: 0, lineWidth: 2, lineColor: ACCENT }] },
    { text: '\n', fontSize: 6 },
    { text: businessName.toUpperCase(), fontSize: 26, bold: true, color: DARK, alignment: 'center', characterSpacing: 2.5 },
    { text: '', margin: [0, 4, 0, 0] },
    { canvas: [{ type: 'line', x1: 140, y1: 0, x2: 375, y2: 0, lineWidth: 2, lineColor: ACCENT }] },
    { text: '\nBusiness Plan', fontSize: 16, color: TEXT_LIGHT, alignment: 'center', margin: [0, 8, 0, 0] },
    { text: date, fontSize: 11, color: TEXT_MUTED, alignment: 'center', margin: [0, 6, 0, 0] },
    { text: '\n\n\n\n\n\n\n\n\n\n\n\n', fontSize: 10 },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: LINE }] },
    {
      margin: [0, 10, 0, 0],
      table: { widths: ['*'], body: [[{
        stack: [
          { text: 'CONFIDENTIAL', bold: true, fontSize: 8, color: ACCENT, characterSpacing: 1.5, alignment: 'center', margin: [0, 0, 0, 4] },
          { text: 'This document contains proprietary business information and is intended solely for the use of the recipient. Unauthorized distribution or reproduction is prohibited.', fontSize: 7, color: TEXT_MUTED, alignment: 'center', lineHeight: 1.4 },
        ],
      }]] },
      layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 20, paddingRight: () => 20, paddingTop: () => 8, paddingBottom: () => 8, fillColor: () => '#f9fafb' },
    },
    { text: '\n', fontSize: 4 },
    { text: 'Prepared with BizPlan Genius', fontSize: 8, color: TEXT_MUTED, alignment: 'center', margin: [0, 4, 0, 1] },
    { text: 'Business Plans with Real Market Research', fontSize: 7, color: LINE, alignment: 'center' },
    { text: '', pageBreak: 'after' },
  );

  /* TOC removed — pdfmake cannot generate real page numbers,
     and a TOC without page numbers looks unprofessional */

  /* ---------- 1. EXECUTIVE SUMMARY ---------- */
  content.push(...sectionHeading(1, 'Executive Summary'));
  if (plan.executiveSummary?.overview) {
    content.push(bodyText(plan.executiveSummary.overview));
  }
  content.push({ ...twoCol('Mission', plan.executiveSummary?.mission || '\u2014', 'Vision', plan.executiveSummary?.vision || '\u2014'), unbreakable: true });
  content.push({ ...calloutBox('Value Proposition', plan.executiveSummary?.valueProposition || '\u2014'), unbreakable: true });
  if (plan.executiveSummary?.keyMetrics?.length) {
    content.push(
      subHeading('Key Projected Metrics'),
      ...bulletList(plan.executiveSummary.keyMetrics),
    );
  }

  /* ---------- 2. COMPETITOR ANALYSIS ---------- */
  content.push(...sectionHeading(2, 'Competitor Analysis'));
  if (plan.competitorAnalysis?.overview) {
    content.push(bodyText(plan.competitorAnalysis.overview));
  }
  (plan.competitorAnalysis?.competitors || []).forEach((c: any) => {
    content.push(competitorEntry(c));
  });
  if (plan.competitorAnalysis?.marketGaps?.length) {
    content.push(
      subHeading('Market Gaps & Opportunities'),
      ...plan.competitorAnalysis.marketGaps.map((g: string, i: number) => ({
        columns: [
          { text: `${i + 1}.`, width: 16, fontSize: 10, color: ACCENT, bold: true },
          { text: g, fontSize: 10, color: TEXT_LIGHT, lineHeight: 1.45, width: '*' },
        ],
        margin: [4, 2, 0, 2],
        columnGap: 4,
      })),
    );
  }

  /* ---------- 3. MARKET ANALYSIS ---------- */
  content.push(...sectionHeading(3, 'Market Analysis'));
  if (plan.marketAnalysis?.industryOverview) {
    content.push(bodyText(plan.marketAnalysis.industryOverview));
  }
  /* Market Size and Growth Rate as separate callout boxes — twoCol creates
     wildly unbalanced columns when one has much more text than the other */
  if (plan.marketAnalysis?.marketSize) {
    content.push({ ...calloutBox('Market Size', plan.marketAnalysis.marketSize), unbreakable: true });
  }
  if (plan.marketAnalysis?.growthRate) {
    content.push({ ...calloutBox('Growth Rate', plan.marketAnalysis.growthRate), unbreakable: true });
  }
  if (plan.marketAnalysis?.trends?.length) {
    content.push(
      subHeading('Key Industry Trends'),
      ...bulletList(plan.marketAnalysis.trends),
    );
  }
  if (plan.marketAnalysis?.targetCustomerProfile) {
    const tcp = plan.marketAnalysis.targetCustomerProfile;
    const tcpStack: any[] = [subHeading('Target Customer Profile')];
    if (tcp.demographics) tcpStack.push(labelValue('Demographics', tcp.demographics));
    if (tcp.psychographics) tcpStack.push(labelValue('Psychographics', tcp.psychographics));
    if (tcp.buyingBehavior) tcpStack.push(labelValue('Buying Behavior', tcp.buyingBehavior));
    if (tcp.painPoints?.length) {
      tcpStack.push({ text: 'Pain Points', bold: true, fontSize: 11, color: ACCENT, margin: [0, 10, 0, 5], headlineLevel: 2 });
      tcpStack.push(...bulletList(tcp.painPoints, { iconColor: DANGER_RED }));
    }
    content.push({ stack: tcpStack });
  }

  /* ---------- 4. MARKETING & SALES STRATEGY ---------- */
  content.push(...sectionHeading(4, 'Marketing & Sales Strategy'));
  if (plan.marketingStrategy?.positioning) {
    content.push({ ...calloutBox('Positioning', plan.marketingStrategy.positioning), unbreakable: true });
  }
  if (plan.marketingStrategy?.channels?.length) {
    const chBody: any[][] = [
      [
        { text: 'Channel', bold: true, fontSize: 8, color: ACCENT },
        { text: 'Priority', bold: true, fontSize: 8, color: ACCENT, alignment: 'center' },
        { text: 'Strategy & CAC', bold: true, fontSize: 8, color: ACCENT },
      ],
    ];
    plan.marketingStrategy.channels.forEach((ch: any) => chBody.push(channelRow(ch)));
    /* Marketing Channels table can be tall (5-6 rows), so don't make the whole
       thing unbreakable — just keep heading with first rows via dontBreakRows.
       But DO keep the heading attached to the table in one stack. */
    content.push({
      stack: [
        subHeading('Marketing Channels'),
        {
          table: { headerRows: 1, dontBreakRows: true, widths: [90, 50, '*'], body: chBody },
          layout: cleanTableLayout(true),
          margin: [0, 0, 0, 6],
        },
      ],
    });
  }
  if (plan.marketingStrategy?.launchPlan) {
    const lp = plan.marketingStrategy.launchPlan;
    const monthBlocks = lp.split(/(?=Month\s+\d)|(?=Phase\s+\d)|(?=Week\s+\d)/i).filter((b: string) => b.trim());
    if (monthBlocks.length >= 2) {
      const lpBody: any[][] = [[
        { text: 'Period', bold: true, fontSize: 8, color: ACCENT },
        { text: 'Activities', bold: true, fontSize: 8, color: ACCENT },
      ]];
      monthBlocks.forEach((block: string) => {
        const colonIdx = block.indexOf(':');
        const parenIdx = block.indexOf('(');
        const splitIdx = colonIdx > 0 ? colonIdx : (parenIdx > 0 && parenIdx < 30 ? block.indexOf(')', parenIdx) + 1 : -1);
        const period = splitIdx > 0 ? block.slice(0, splitIdx).replace(/[():]/g, '').trim() : 'Phase';
        const activities = splitIdx > 0 ? block.slice(splitIdx).replace(/^[():]\s*/, '').trim() : block.trim();
        lpBody.push([
          { text: period, fontSize: 9, color: ACCENT, bold: true },
          { text: activities, fontSize: 9, color: TEXT_LIGHT, lineHeight: 1.35 },
        ]);
      });
      /* Wrap heading + table together so they never split across pages */
      content.push({
        unbreakable: true,
        stack: [
          subHeading('90-Day Launch Plan'),
          {
            table: { headerRows: 1, dontBreakRows: true, widths: [75, '*'], body: lpBody },
            layout: cleanTableLayout(true),
            margin: [0, 0, 0, 6],
          },
        ],
      });
    } else {
      content.push({ ...calloutBox('90-Day Launch Plan', lp), unbreakable: true });
    }
  }

  /* ---------- 5. FINANCIAL PROJECTIONS ---------- */
  content.push(...sectionHeading(5, 'Financial Projections'));
  if (plan.financialProjections?.revenueModel) {
    content.push(bodyText(plan.financialProjections.revenueModel));
  }
  const y1 = plan.financialProjections?.year1 || {};
  const y2 = plan.financialProjections?.year2 || {};
  const y3 = plan.financialProjections?.year3 || {};

  const finBody = [
    [
      { text: 'Metric', bold: true, fontSize: 8, color: ACCENT },
      { text: 'Year 1', bold: true, fontSize: 8, color: ACCENT, alignment: 'right' },
      { text: 'Year 2', bold: true, fontSize: 8, color: ACCENT, alignment: 'right' },
      { text: 'Year 3', bold: true, fontSize: 8, color: ACCENT, alignment: 'right' },
    ],
    [{ text: 'Revenue', fontSize: 10, color: TEXT }, { text: y1.revenue || '\u2014', alignment: 'right', fontSize: 10, color: TEXT }, { text: y2.revenue || '\u2014', alignment: 'right', fontSize: 10, color: TEXT }, { text: y3.revenue || '\u2014', alignment: 'right', fontSize: 10, bold: true, color: ACCENT }],
    [{ text: 'Costs', fontSize: 10, color: TEXT }, { text: y1.costs || '\u2014', alignment: 'right', fontSize: 10, color: TEXT }, { text: y2.costs || '\u2014', alignment: 'right', fontSize: 10, color: TEXT }, { text: y3.costs || '\u2014', alignment: 'right', fontSize: 10, color: TEXT }],
    [{ text: 'Net Profit', fontSize: 10, color: TEXT, bold: true }, { text: y1.profit || '\u2014', alignment: 'right', fontSize: 10, color: TEXT }, { text: y2.profit || '\u2014', alignment: 'right', fontSize: 10, color: TEXT }, { text: y3.profit || '\u2014', alignment: 'right', fontSize: 10, bold: true, color: SUCCESS_GREEN }],
    [{ text: 'Customers', fontSize: 10, color: TEXT }, { text: y1.customers || '\u2014', alignment: 'right', fontSize: 10, color: TEXT }, { text: y2.customers || '\u2014', alignment: 'right', fontSize: 10, color: TEXT }, { text: y3.customers || '\u2014', alignment: 'right', fontSize: 10, color: TEXT }],
  ];
  content.push({
    table: { headerRows: 1, dontBreakRows: true, widths: ['*', 'auto', 'auto', 'auto'], body: finBody },
    layout: {
      ...cleanTableLayout(true),
      fillColor: (rowIndex: number) => rowIndex === 0 ? ACCENT_LIGHT : (rowIndex % 2 === 0 ? '#fafbfc' : null),
    },
    margin: [0, 0, 0, 8],
  });

  if (plan.financialProjections?.breakEvenTimeline) {
    content.push(labelValue('Break-even Timeline', plan.financialProjections.breakEvenTimeline));
  }
  if (plan.financialProjections?.startupCosts?.length) {
    const scBody: any[][] = [[
      { text: 'Item', bold: true, fontSize: 8, color: ACCENT },
      { text: 'Amount', bold: true, fontSize: 8, color: ACCENT, alignment: 'right' },
    ]];
    let totalAmount = 0;
    plan.financialProjections.startupCosts.forEach((c: any) => {
      scBody.push([{ text: c.item || '', fontSize: 10, color: TEXT }, { text: c.amount || '', alignment: 'right', fontSize: 10, color: TEXT }]);
      /* Try to extract numeric value for total */
      const num = parseFloat((c.amount || '').replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) totalAmount += num;
    });
    /* Add total row */
    if (totalAmount > 0) {
      scBody.push([
        { text: 'TOTAL', bold: true, fontSize: 10, color: ACCENT },
        { text: '$' + totalAmount.toLocaleString('en-US'), alignment: 'right', fontSize: 10, color: ACCENT, bold: true },
      ]);
    }
    content.push({
      unbreakable: true,
      stack: [
        subHeading('Startup Costs'),
        {
          table: { headerRows: 1, dontBreakRows: true, widths: ['*', 'auto'], body: scBody },
          layout: cleanTableLayout(true),
          margin: [0, 0, 0, 6],
        },
      ],
    });
  }
  if (plan.financialProjections?.fundingNeeded) {
    content.push({ ...calloutBox('Funding Requirement', plan.financialProjections.fundingNeeded), unbreakable: true });
  }

  /* ---------- 6. OPERATIONS PLAN ---------- */
  content.push(...sectionHeading(6, 'Operations Plan'));
  /* Operations sections often contain "- **Bold Title:** description" lines from Gemini.
     Parse these into proper structured bullet points instead of raw text. */
  function parseOpsSection(raw: string): any[] {
    if (!raw) return [{ text: '\u2014', fontSize: 10, color: TEXT_LIGHT }];
    const lines = raw.split('\n').filter((l: string) => l.trim());
    const result: any[] = [];
    let paragraphLines: string[] = [];
    const flushParagraph = () => {
      if (paragraphLines.length) {
        result.push(parseMarkdownText(paragraphLines.join(' ')));
        result.push({ text: '', margin: [0, 3, 0, 0] });
        paragraphLines = [];
      }
    };
    lines.forEach((line: string) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushParagraph();
        const bulletText = trimmed.slice(2);
        /* Parse **bold:** pattern inside bullet */
        const boldMatch = bulletText.match(/^\*\*(.+?)\*\*[:\s]*(.*)/);
        if (boldMatch) {
          result.push({
            columns: [
              { text: '\u2022', width: 12, fontSize: 10, color: ACCENT, alignment: 'center' },
              { text: [
                { text: boldMatch[1] + ': ', bold: true, color: TEXT },
                { text: boldMatch[2] || '', color: TEXT_LIGHT },
              ], fontSize: 10, lineHeight: 1.45, width: '*' },
            ],
            margin: [4, 2, 0, 2],
            columnGap: 4,
          });
        } else {
          result.push({
            columns: [
              { text: '\u2022', width: 12, fontSize: 10, color: ACCENT, alignment: 'center' },
              parseMarkdownText(bulletText),
            ],
            margin: [4, 2, 0, 2],
            columnGap: 4,
          });
        }
      } else {
        paragraphLines.push(trimmed);
      }
    });
    flushParagraph();
    return result;
  }
  if (plan.operationsPlan?.businessModel) {
    content.push(subHeading('Business Model'), ...parseOpsSection(plan.operationsPlan.businessModel));
  }
  if (plan.operationsPlan?.teamStructure) {
    content.push(subHeading('Team Structure'), ...parseOpsSection(plan.operationsPlan.teamStructure));
  }
  if (plan.operationsPlan?.technology) {
    content.push(subHeading('Technology'), ...parseOpsSection(plan.operationsPlan.technology));
  }
  if (plan.operationsPlan?.keyMilestones?.length) {
    const msBody: any[][] = [[
      { text: 'Timeline', bold: true, fontSize: 8, color: ACCENT },
      { text: 'Milestone', bold: true, fontSize: 8, color: ACCENT },
    ]];
    plan.operationsPlan.keyMilestones.forEach((m: any) => {
      msBody.push([{ text: m.timeline || '', fontSize: 9, color: ACCENT, bold: true }, { text: m.milestone || '', fontSize: 9, color: TEXT }]);
    });
    content.push({
      unbreakable: true,
      stack: [
        subHeading('Key Milestones'),
        {
          table: { headerRows: 1, dontBreakRows: true, widths: ['auto', '*'], body: msBody },
          layout: cleanTableLayout(true),
        },
      ],
    });
  }

  /* ---------- 7. RISK ANALYSIS ---------- */
  content.push(...sectionHeading(7, 'Risk Analysis'));
  if (plan.riskAnalysis?.risks?.length) {
    const rBody: any[][] = [
      [
        { text: 'Risk', bold: true, fontSize: 8, color: ACCENT },
        { text: 'Likelihood', bold: true, fontSize: 8, color: ACCENT, alignment: 'center' },
        { text: 'Mitigation Strategy', bold: true, fontSize: 8, color: ACCENT },
      ],
    ];
    plan.riskAnalysis.risks.forEach((r: any) => rBody.push(riskRow(r)));
    content.push({
      table: { headerRows: 1, dontBreakRows: true, widths: ['*', 55, '*'], body: rBody },
      layout: cleanTableLayout(true),
    });
  }

  /* ---------- FOOTER ---------- */
  content.push({
    unbreakable: true,
    stack: [
      { text: '', margin: [0, 20, 0, 0] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: LINE }] },
      { text: `Generated by BizPlan Genius  \u2014  ${date}`, fontSize: 8, color: TEXT_MUTED, alignment: 'center', margin: [0, 10, 0, 2] },
      { text: 'bizplangenius.com', fontSize: 8, color: ACCENT, alignment: 'center', margin: [0, 0, 0, 4] },
    ],
  });

  return {
    pageSize: 'A4' as const,
    pageMargins: [40, 55, 40, 45] as [number, number, number, number],
    header: (currentPage: number) => {
      if (currentPage === 1) return null;
      return {
        columns: [
          { text: businessName, fontSize: 7, color: TEXT_MUTED, margin: [40, 20, 0, 0] },
          { text: 'CONFIDENTIAL', fontSize: 7, color: TEXT_MUTED, alignment: 'center', margin: [0, 20, 0, 0], characterSpacing: 1 },
          { text: 'BizPlan Genius', fontSize: 7, color: TEXT_MUTED, alignment: 'right', margin: [0, 20, 40, 0] },
        ],
      };
    },
    footer: (currentPage: number, pageCount: number) => {
      if (currentPage === 1) return null;
      return {
        columns: [
          { text: 'bizplangenius.com', fontSize: 7, color: LINE, margin: [40, 10, 0, 0] },
          { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', fontSize: 7, color: TEXT_MUTED, margin: [0, 10, 40, 0] },
        ],
      };
    },
    content,
    defaultStyle: { font: 'Roboto', fontSize: 10, color: TEXT, lineHeight: 1.3 },
    pageBreakBefore: (currentNode: any, followingNodesOnPage: any[]) => {
      /* Prevent orphaned sub-headings: if a bold sub-heading lands at the very
         bottom of a page with fewer than 3 nodes after it, push to next page */
      if (currentNode.headlineLevel === 2 && followingNodesOnPage.length <= 2) {
        return true;
      }
      return false;
    },
  };
}

/* ================================================================
   PAGE COMPONENT
   ================================================================ */

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'generating' | 'done' | 'error'>('loading');
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [progress, setProgress] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      setStatus('error');
      return;
    }

    setStatus('generating');
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 8, 90));
    }, 500);

    fetch('/api/fulfill', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) })
      .then(res => res.json())
      .then(data => {
        clearInterval(interval);
        if (data.plan) {
          setProgress(100);
          setBusinessName(data.businessName || 'Business Plan');
          setTimeout(() => {
            setPlan(data.plan);
            setStatus('done');
          }, 500);
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        clearInterval(interval);
        setStatus('error');
      });
  }, []);

  async function handleDownload() {
    if (!plan) return;
    const btn = document.getElementById('download-btn');
    const mobileBtn = document.getElementById('download-btn-mobile');
    const setLoading = (loading: boolean) => {
      [btn, mobileBtn].forEach(b => {
        if (!b) return;
        if (loading) { b.textContent = 'Generating PDF...'; (b as HTMLButtonElement).disabled = true; b.classList.add('opacity-60'); }
        else { b.textContent = 'Download Business Plan (PDF)'; (b as HTMLButtonElement).disabled = false; b.classList.remove('opacity-60'); }
      });
    };
    setLoading(true);
    try {
      await loadPdfMake();
      const docDef = buildPDF(plan, businessName);
      const safeName = businessName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
      (window as any).pdfMake.createPdf(docDef).download(`${safeName}-Business-Plan.pdf`);
    } catch (e) {
      console.error('PDF error:', e);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /* ---- Loading / Generating state ---- */
  if (status === 'loading' || status === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
              <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Building Your Business Plan</h1>
            <p className="text-gray-500">Our AI is researching your market, analyzing competitors, and crafting your plan...</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 font-medium">
            {progress < 25 ? 'Researching competitors...' :
             progress < 50 ? 'Analyzing market data...' :
             progress < 75 ? 'Building financial projections...' :
             progress < 95 ? 'Writing your business plan...' :
             'Almost ready...'}
          </p>
        </div>
      </div>
    );
  }

  /* ---- Error state ---- */
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-gray-500 mb-6">
            Don&apos;t worry — your payment is safe. Please contact us and we&apos;ll generate your plan right away.
          </p>
          <a href="mailto:support@bizplangenius.com" className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print-friendly styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          header, .print-hide, [class*="fixed bottom"] { display: none !important; }
          body, .min-h-screen { background: white !important; }
          section { box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 16px 0 !important; break-inside: avoid; }
          @page { margin: 1in 0.75in; }
          h2 { break-after: avoid; }
        }
      `}} />

      {/* Sticky Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 print-hide">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-gray-900">
            <span className="text-blue-600">BizPlan</span> Genius
          </a>
          <button
            id="download-btn"
            onClick={handleDownload}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Download Business Plan (PDF)
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-28 sm:pb-12">

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 sm:p-8 text-center mb-8 print-hide">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Business Plan is Ready</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Review your complete plan below. Download the professional PDF to share with investors, banks, or partners.</p>
          <button
            onClick={handleDownload}
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm shadow-sm sm:hidden"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Download PDF
          </button>
        </div>

        {/* Plan Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{businessName}</h2>
          <p className="text-sm text-gray-400 mt-1">{generatedDate}</p>
        </div>

        {/* ==================== 1. EXECUTIVE SUMMARY ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
            Executive Summary
          </h2>
          <p className="text-gray-600 leading-relaxed mb-5 whitespace-pre-line text-sm">{plan.executiveSummary.overview}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">Mission</p>
              <p className="text-gray-700 text-sm">{plan.executiveSummary.mission}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">Vision</p>
              <p className="text-gray-700 text-sm">{plan.executiveSummary.vision}</p>
            </div>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100/50">
            <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Value Proposition</p>
            <p className="text-gray-700 text-sm">{plan.executiveSummary.valueProposition}</p>
          </div>
          {plan.executiveSummary.keyMetrics && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Key Projected Metrics</p>
              <ul className="space-y-1.5">
                {plan.executiveSummary.keyMetrics.map((m: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ==================== 2. COMPETITOR ANALYSIS ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
            Competitor Analysis
          </h2>
          <p className="text-gray-600 leading-relaxed mb-5 text-sm">{plan.competitorAnalysis.overview}</p>
          <div className="space-y-3">
            {plan.competitorAnalysis.competitors?.map((c: any, i: number) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{c.name}</h3>
                  {c.pricing && <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full">{c.pricing}</span>}
                </div>
                <p className="text-xs text-gray-500 mb-3">{c.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-green-600 mb-1">STRENGTHS</p>
                    {c.strengths?.map((s: string, j: number) => (
                      <p key={j} className="text-xs text-gray-600 leading-relaxed">+ {s}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-1">WEAKNESSES</p>
                    {c.weaknesses?.map((w: string, j: number) => (
                      <p key={j} className="text-xs text-gray-500 leading-relaxed">- {w}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {plan.competitorAnalysis.marketGaps && (
            <div className="mt-5 p-4 bg-blue-50/60 rounded-xl border border-blue-100/50">
              <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wider">Market Gaps &amp; Opportunities</p>
              {plan.competitorAnalysis.marketGaps.map((g: string, i: number) => (
                <p key={i} className="text-sm text-gray-600 mb-1 flex items-start gap-2">
                  <span className="text-blue-500 font-semibold">{i + 1}.</span> {g}
                </p>
              ))}
            </div>
          )}
        </section>

        {/* ==================== 3. MARKET ANALYSIS ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">3</span>
            Market Analysis
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line text-sm">{plan.marketAnalysis.industryOverview}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Market Size</p>
              <p className="text-sm text-gray-700 mt-1">{plan.marketAnalysis.marketSize}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Growth Rate</p>
              <p className="text-sm text-gray-700 mt-1">{plan.marketAnalysis.growthRate}</p>
            </div>
          </div>
          {plan.marketAnalysis.trends && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Key Industry Trends</p>
              {plan.marketAnalysis.trends.map((t: string, i: number) => (
                <p key={i} className="flex items-start gap-2.5 text-sm text-gray-600 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span> {t}
                </p>
              ))}
            </div>
          )}
          {plan.marketAnalysis.targetCustomerProfile && (
            <div className="p-4 border border-gray-100 rounded-xl">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Target Customer Profile</p>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-gray-700">Demographics:</span> <span className="text-gray-500">{plan.marketAnalysis.targetCustomerProfile.demographics}</span></p>
                <p><span className="font-medium text-gray-700">Psychographics:</span> <span className="text-gray-500">{plan.marketAnalysis.targetCustomerProfile.psychographics}</span></p>
                <p><span className="font-medium text-gray-700">Buying Behavior:</span> <span className="text-gray-500">{plan.marketAnalysis.targetCustomerProfile.buyingBehavior}</span></p>
                {plan.marketAnalysis.targetCustomerProfile.painPoints && (
                  <div>
                    <span className="font-medium text-gray-700">Pain Points:</span>
                    {plan.marketAnalysis.targetCustomerProfile.painPoints.map((p: string, i: number) => (
                      <p key={i} className="text-gray-500 ml-4 mt-1 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-300 mt-1.5 flex-shrink-0"></span> {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ==================== 4. MARKETING & SALES STRATEGY ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">4</span>
            Marketing &amp; Sales Strategy
          </h2>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100/50 mb-5">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Positioning</p>
            <p className="text-sm text-gray-700 mt-1">{plan.marketingStrategy.positioning}</p>
          </div>
          {plan.marketingStrategy.channels && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Marketing Channels</p>
              <div className="space-y-2.5">
                {plan.marketingStrategy.channels.map((ch: any, i: number) => (
                  <div key={i} className="p-3.5 border border-gray-100 rounded-xl flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{ch.channel}</p>
                      <p className="text-xs text-gray-500 mt-1">{ch.strategy}</p>
                      {ch.estimatedCAC && <p className="text-xs text-gray-400 mt-1">Est. CAC: {ch.estimatedCAC}</p>}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${ch.priority === 'High' ? 'bg-red-50 text-red-600' : ch.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'}`}>
                      {ch.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {plan.marketingStrategy.launchPlan && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">90-Day Launch Plan</p>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{plan.marketingStrategy.launchPlan}</p>
            </div>
          )}
        </section>

        {/* ==================== 5. FINANCIAL PROJECTIONS ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">5</span>
            Financial Projections
          </h2>
          <p className="text-gray-600 mb-5 text-sm">{plan.financialProjections.revenueModel}</p>
          <div className="overflow-x-auto mb-5 rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Metric</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Year 1</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Year 2</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Year 3</th>
                </tr>
              </thead>
              <tbody>
                {['revenue', 'costs', 'profit', 'customers'].map((metric, idx) => (
                  <tr key={metric} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="py-3 px-4 font-medium text-gray-700 capitalize text-sm">{metric === 'profit' ? 'Net Profit' : metric}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{plan.financialProjections.year1?.[metric]}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{plan.financialProjections.year2?.[metric]}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${metric === 'profit' ? 'text-green-600' : 'text-blue-600'}`}>{plan.financialProjections.year3?.[metric]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plan.financialProjections.breakEvenTimeline && (
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold text-gray-700">Break-even:</span> {plan.financialProjections.breakEvenTimeline}
            </p>
          )}
          {plan.financialProjections.startupCosts && (
            <div className="p-4 bg-gray-50 rounded-xl mb-4">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Startup Costs</p>
              {plan.financialProjections.startupCosts.map((c: any, i: number) => (
                <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">{c.item}</span>
                  <span className="font-medium text-gray-700">{c.amount}</span>
                </div>
              ))}
            </div>
          )}
          {plan.financialProjections.fundingNeeded && (
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100/50">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Funding Requirement</p>
              <p className="text-sm text-gray-700 mt-1">{plan.financialProjections.fundingNeeded}</p>
            </div>
          )}
        </section>

        {/* ==================== 6. OPERATIONS PLAN ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">6</span>
            Operations Plan
          </h2>
          <div className="space-y-4 text-sm">
            {plan.operationsPlan.businessModel && (
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">Business Model</p>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{plan.operationsPlan.businessModel}</p>
              </div>
            )}
            {plan.operationsPlan.teamStructure && (
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">Team Structure</p>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{plan.operationsPlan.teamStructure}</p>
              </div>
            )}
            {plan.operationsPlan.technology && (
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">Technology</p>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{plan.operationsPlan.technology}</p>
              </div>
            )}
          </div>
          {plan.operationsPlan.keyMilestones && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Key Milestones</p>
              <div className="space-y-2">
                {plan.operationsPlan.keyMilestones.map((m: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-sm p-2.5 rounded-lg bg-gray-50">
                    <span className="font-semibold text-blue-600 min-w-[80px] text-xs mt-0.5">{m.timeline}</span>
                    <span className="text-gray-600">{m.milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ==================== 7. RISK ANALYSIS ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">7</span>
            Risk Analysis
          </h2>
          <div className="space-y-2.5">
            {plan.riskAnalysis.risks?.map((r: any, i: number) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl">
                <div className="flex items-start justify-between mb-2 gap-3">
                  <p className="font-medium text-gray-900 text-sm">{r.risk}</p>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${r.likelihood === 'High' ? 'bg-red-50 text-red-600' : r.likelihood === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                    {r.likelihood}
                  </span>
                </div>
                <p className="text-xs text-gray-500"><span className="font-medium text-gray-600">Mitigation:</span> {r.mitigation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Download CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-center text-white print-hide">
          <h3 className="text-lg font-bold mb-2">Ready to share your plan?</h3>
          <p className="text-blue-100 text-sm mb-4">Download a professional PDF ready for banks, investors, and partners.</p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition text-sm shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Download Business Plan (PDF)
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-xs text-gray-400 print-hide">
          <p>Generated by BizPlan Genius — bizplangenius.com</p>
          <p className="mt-1">{generatedDate}</p>
        </div>
      </main>

      {/* Floating Download Bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 z-50 sm:hidden print-hide">
        <button
          id="download-btn-mobile"
          onClick={handleDownload}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Download Business Plan (PDF)
        </button>
      </div>
    </div>
  );
}
