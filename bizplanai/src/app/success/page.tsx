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
   PDF GENERATION â pdfmake (native vector PDF, not screenshots)
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

/* ---- helpers ---- */

const BLUE = '#1d4ed8';
const BLUE_LIGHT = '#eff6ff';
const BLUE_BORDER = '#dbeafe';
const GREEN = '#059669';
const GREEN_LIGHT = '#ecfdf5';
const GRAY = '#374151';
const GRAY_LIGHT = '#6b7280';
const GRAY_MUTED = '#9ca3af';
const RED = '#dc2626';
const GREEN_TEXT = '#16a34a';

function heading(num: number, title: string): any[] {
  return [
    { text: `${num}. ${title}`, fontSize: 18, bold: true, color: BLUE, margin: [0, 0, 0, 8] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, lineColor: BLUE_BORDER }], margin: [0, 0, 0, 16] },
  ];
}

function box(label: string, text: string, bg = BLUE_LIGHT, labelColor = BLUE): any {
  return {
    unbreakable: true,
    margin: [0, 4, 0, 4],
    table: { widths: ['*'], body: [[{
      stack: [
        { text: label, bold: true, fontSize: 11, color: labelColor, margin: [0, 0, 0, 4] },
        { text: text || 'â', fontSize: 10, color: GRAY, lineHeight: 1.4 },
      ],
      fillColor: bg,
    }]] },
    layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 14, paddingRight: () => 14, paddingTop: () => 10, paddingBottom: () => 10 },
  };
}

function twoBoxes(l1: string, t1: string, l2: string, t2: string, bg = BLUE_LIGHT, lc = BLUE): any {
  return {
    columns: [
      { ...box(l1, t1, bg, lc), width: '*' },
      { text: '', width: 10 },
      { ...box(l2, t2, bg, lc), width: '*' },
    ],
    margin: [0, 4, 0, 4],
  };
}

function competitorCard(c: any): any {
  return {
    unbreakable: true,
    margin: [0, 4, 0, 4],
    table: { widths: ['*'], body: [[{
      stack: [
        { columns: [
          { text: c.name || '', bold: true, fontSize: 12, color: '#111827', width: '*' },
          c.pricing ? { text: c.pricing, fontSize: 9, color: GRAY_LIGHT, alignment: 'right', width: 'auto' } : { text: '' },
        ], margin: [0, 0, 0, 4] },
        c.description ? { text: c.description, fontSize: 10, color: GRAY_LIGHT, margin: [0, 0, 0, 8] } : null,
        { columns: [
          { width: '*', stack: [
            { text: 'STRENGTHS', fontSize: 9, bold: true, color: GREEN_TEXT, margin: [0, 0, 0, 3] },
            ...(c.strengths || []).map((s: string) => ({ text: `+ ${s}`, fontSize: 9, color: GRAY, margin: [0, 1, 0, 1] })),
          ]},
          { width: '*', stack: [
            { text: 'WEAKNESSES', fontSize: 9, bold: true, color: RED, margin: [0, 0, 0, 3] },
            ...(c.weaknesses || []).map((w: string) => ({ text: `- ${w}`, fontSize: 9, color: GRAY, margin: [0, 1, 0, 1] })),
          ]},
        ]},
      ].filter(Boolean),
    }]] },
    layout: { hLineWidth: () => 0.5, vLineWidth: () => 0.5, hLineColor: () => '#e5e7eb', vLineColor: () => '#e5e7eb', paddingLeft: () => 14, paddingRight: () => 14, paddingTop: () => 12, paddingBottom: () => 12 },
  };
}

function riskCard(r: any): any {
  const lc = r.likelihood === 'High' ? '#dc2626' : r.likelihood === 'Medium' ? '#d97706' : '#16a34a';
  return {
    unbreakable: true,
    margin: [0, 3, 0, 3],
    table: { widths: ['*'], body: [[{
      stack: [
        { columns: [
          { text: r.risk || '', bold: true, fontSize: 11, color: '#111827', width: '*' },
          { text: r.likelihood || '', fontSize: 9, bold: true, color: lc, width: 'auto', alignment: 'right' },
        ], margin: [0, 0, 0, 4] },
        r.mitigation ? { text: [{ text: 'Mitigation: ', bold: true, fontSize: 9 }, { text: r.mitigation, fontSize: 9 }], color: GRAY } : null,
      ].filter(Boolean),
    }]] },
    layout: { hLineWidth: () => 0.5, vLineWidth: () => 0.5, hLineColor: () => '#e5e7eb', vLineColor: () => '#e5e7eb', paddingLeft: () => 14, paddingRight: () => 14, paddingTop: () => 10, paddingBottom: () => 10 },
  };
}

function channelCard(ch: any): any {
  const pc = ch.priority === 'High' ? '#dc2626' : ch.priority === 'Medium' ? '#d97706' : GRAY_LIGHT;
  return {
    unbreakable: true,
    margin: [0, 3, 0, 3],
    table: { widths: ['*'], body: [[{
      stack: [
        { columns: [
          { text: ch.channel || '', bold: true, fontSize: 11, color: '#111827', width: '*' },
          { text: ch.priority || '', fontSize: 9, bold: true, color: pc, width: 'auto', alignment: 'right' },
        ], margin: [0, 0, 0, 3] },
        ch.strategy ? { text: ch.strategy, fontSize: 10, color: GRAY_LIGHT, margin: [0, 0, 0, 3] } : null,
        ch.estimatedCAC ? { text: `Est. CAC: ${ch.estimatedCAC}`, fontSize: 9, color: GRAY_MUTED } : null,
      ].filter(Boolean),
    }]] },
    layout: { hLineWidth: () => 0.5, vLineWidth: () => 0.5, hLineColor: () => '#e5e7eb', vLineColor: () => '#e5e7eb', paddingLeft: () => 14, paddingRight: () => 14, paddingTop: () => 10, paddingBottom: () => 10 },
  };
}

/* ---- main document builder ---- */

function buildPDF(plan: BusinessPlan, businessName: string) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const content: any[] = [];

  /* ---------- COVER PAGE ---------- */
  content.push(
    { text: '\n\n\n\n\n\n\n\n\n\n', fontSize: 10 },
    { text: businessName, fontSize: 32, bold: true, color: BLUE, alignment: 'center' },
    { text: '\n', fontSize: 6 },
    { canvas: [{ type: 'line', x1: 140, y1: 0, x2: 375, y2: 0, lineWidth: 2, lineColor: '#3b82f6' }], alignment: 'center' },
    { text: '\nBusiness Plan', fontSize: 20, color: GRAY_LIGHT, alignment: 'center' },
    { text: `\n\n${date}`, fontSize: 11, color: GRAY_MUTED, alignment: 'center' },
    { text: '\n\n\n\n\n\n\n\n\n\n\n\n\n\n', fontSize: 10 },
    { text: 'Prepared with BizPlan Genius', fontSize: 10, color: GRAY_MUTED, alignment: 'center' },
    { text: 'AI-Powered Business Plans with Real Market Research', fontSize: 9, color: '#d1d5db', alignment: 'center' },
    { text: '', pageBreak: 'after' },
  );

  /* ---------- 1. EXECUTIVE SUMMARY ---------- */
  content.push(...heading(1, 'Executive Summary'));
  if (plan.executiveSummary?.overview) {
    content.push({ text: plan.executiveSummary.overview, fontSize: 10, color: GRAY, lineHeight: 1.5, margin: [0, 0, 0, 12] });
  }
  content.push(twoBoxes('Mission', plan.executiveSummary?.mission || 'â', 'Vision', plan.executiveSummary?.vision || 'â'));
  content.push(box('Value Proposition', plan.executiveSummary?.valueProposition || 'â', GREEN_LIGHT, GREEN));
  if (plan.executiveSummary?.keyMetrics?.length) {
    content.push(
      { text: 'Key Projected Metrics', bold: true, fontSize: 11, color: GRAY, margin: [0, 12, 0, 6] },
      { ul: plan.executiveSummary.keyMetrics, fontSize: 10, color: GRAY, lineHeight: 1.4, margin: [0, 0, 0, 4] },
    );
  }
  content.push({ text: '', pageBreak: 'after' });

  /* ---------- 2. COMPETITOR ANALYSIS ---------- */
  content.push(...heading(2, 'Competitor Analysis'));
  if (plan.competitorAnalysis?.overview) {
    content.push({ text: plan.competitorAnalysis.overview, fontSize: 10, color: GRAY, lineHeight: 1.5, margin: [0, 0, 0, 12] });
  }
  (plan.competitorAnalysis?.competitors || []).forEach((c: any) => {
    content.push(competitorCard(c));
  });
  if (plan.competitorAnalysis?.marketGaps?.length) {
    content.push(
      { text: '', margin: [0, 8, 0, 0] },
      box('Market Gaps & Opportunities', plan.competitorAnalysis.marketGaps.map((g: string) => `â ${g}`).join('\n'), GREEN_LIGHT, GREEN),
    );
  }
  content.push({ text: '', pageBreak: 'after' });

  /* ---------- 3. MARKET ANALYSIS ---------- */
  content.push(...heading(3, 'Market Analysis'));
  if (plan.marketAnalysis?.industryOverview) {
    content.push({ text: plan.marketAnalysis.industryOverview, fontSize: 10, color: GRAY, lineHeight: 1.5, margin: [0, 0, 0, 12] });
  }
  content.push(twoBoxes('Market Size', plan.marketAnalysis?.marketSize || 'â', 'Growth Rate', plan.marketAnalysis?.growthRate || 'â'));
  if (plan.marketAnalysis?.trends?.length) {
    content.push(
      { text: 'Key Industry Trends', bold: true, fontSize: 11, color: GRAY, margin: [0, 12, 0, 6] },
      ...plan.marketAnalysis.trends.map((t: string) => ({ text: `â¢ ${t}`, fontSize: 10, color: GRAY, lineHeight: 1.4, margin: [8, 1, 0, 1] })),
    );
  }
  if (plan.marketAnalysis?.targetCustomerProfile) {
    const tcp = plan.marketAnalysis.targetCustomerProfile;
    const lines: any[] = [];
    if (tcp.demographics) lines.push({ text: [{ text: 'Demographics: ', bold: true }, tcp.demographics], fontSize: 10, color: GRAY, margin: [0, 2, 0, 2] });
    if (tcp.psychographics) lines.push({ text: [{ text: 'Psychographics: ', bold: true }, tcp.psychographics], fontSize: 10, color: GRAY, margin: [0, 2, 0, 2] });
    if (tcp.buyingBehavior) lines.push({ text: [{ text: 'Buying Behavior: ', bold: true }, tcp.buyingBehavior], fontSize: 10, color: GRAY, margin: [0, 2, 0, 2] });
    if (tcp.painPoints?.length) {
      lines.push({ text: 'Pain Points:', bold: true, fontSize: 10, color: GRAY, margin: [0, 4, 0, 2] });
      tcp.painPoints.forEach((p: string) => lines.push({ text: `â¢ ${p}`, fontSize: 10, color: GRAY, margin: [12, 1, 0, 1] }));
    }
    content.push({
      unbreakable: true,
      margin: [0, 12, 0, 4],
      table: { widths: ['*'], body: [[{ stack: [{ text: 'Target Customer Profile', bold: true, fontSize: 12, color: '#111827', margin: [0, 0, 0, 8] }, ...lines] }]] },
      layout: { hLineWidth: () => 0.5, vLineWidth: () => 0.5, hLineColor: () => '#e5e7eb', vLineColor: () => '#e5e7eb', paddingLeft: () => 14, paddingRight: () => 14, paddingTop: () => 12, paddingBottom: () => 12 },
    });
  }
  content.push({ text: '', pageBreak: 'after' });

  /* ---------- 4. MARKETING & SALES STRATEGY ---------- */
  content.push(...heading(4, 'Marketing & Sales Strategy'));
  if (plan.marketingStrategy?.positioning) {
    content.push(box('Positioning', plan.marketingStrategy.positioning));
  }
  if (plan.marketingStrategy?.channels?.length) {
    content.push({ text: 'Marketing Channels', bold: true, fontSize: 11, color: GRAY, margin: [0, 10, 0, 6] });
    plan.marketingStrategy.channels.forEach((ch: any) => content.push(channelCard(ch)));
  }
  if (plan.marketingStrategy?.launchPlan) {
    content.push({ text: '', margin: [0, 6, 0, 0] });
    content.push(box('90-Day Launch Plan', plan.marketingStrategy.launchPlan, GREEN_LIGHT, GREEN));
  }
  content.push({ text: '', pageBreak: 'after' });

  /* ---------- 5. FINANCIAL PROJECTIONS ---------- */
  content.push(...heading(5, 'Financial Projections'));
  if (plan.financialProjections?.revenueModel) {
    content.push({ text: plan.financialProjections.revenueModel, fontSize: 10, color: GRAY, lineHeight: 1.5, margin: [0, 0, 0, 12] });
  }
  const y1 = plan.financialProjections?.year1 || {};
  const y2 = plan.financialProjections?.year2 || {};
  const y3 = plan.financialProjections?.year3 || {};
  content.push({
    margin: [0, 0, 0, 12],
    table: {
      headerRows: 1,
      widths: ['*', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: 'Metric', bold: true, fillColor: '#f9fafb', fontSize: 10, color: GRAY },
          { text: 'Year 1', bold: true, fillColor: '#f9fafb', fontSize: 10, color: GRAY, alignment: 'right' },
          { text: 'Year 2', bold: true, fillColor: '#f9fafb', fontSize: 10, color: GRAY, alignment: 'right' },
          { text: 'Year 3', bold: true, fillColor: '#f9fafb', fontSize: 10, color: GRAY, alignment: 'right' },
        ],
        [{ text: 'Revenue', fontSize: 10 }, { text: y1.revenue || 'â', alignment: 'right', fontSize: 10 }, { text: y2.revenue || 'â', alignment: 'right', fontSize: 10 }, { text: y3.revenue || 'â', alignment: 'right', fontSize: 10, bold: true, color: GREEN }],
        [{ text: 'Costs', fontSize: 10 }, { text: y1.costs || 'â', alignment: 'right', fontSize: 10 }, { text: y2.costs || 'â', alignment: 'right', fontSize: 10 }, { text: y3.costs || 'â', alignment: 'right', fontSize: 10 }],
        [{ text: 'Profit', fontSize: 10 }, { text: y1.profit || 'â', alignment: 'right', fontSize: 10 }, { text: y2.profit || 'â', alignment: 'right', fontSize: 10 }, { text: y3.profit || 'â', alignment: 'right', fontSize: 10, bold: true, color: GREEN }],
        [{ text: 'Customers', fontSize: 10 }, { text: y1.customers || 'â', alignment: 'right', fontSize: 10 }, { text: y2.customers || 'â', alignment: 'right', fontSize: 10 }, { text: y3.customers || 'â', alignment: 'right', fontSize: 10 }],
      ],
    },
    layout: {
      hLineWidth: (i: number, node: any) => (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5,
      vLineWidth: () => 0,
      hLineColor: (i: number) => i <= 1 ? '#d1d5db' : '#f3f4f6',
      paddingLeft: () => 10,
      paddingRight: () => 10,
      paddingTop: () => 6,
      paddingBottom: () => 6,
    },
  });
  if (plan.financialProjections?.breakEvenTimeline) {
    content.push({ text: [{ text: 'Break-even: ', bold: true }, plan.financialProjections.breakEvenTimeline], fontSize: 10, color: GRAY, margin: [0, 0, 0, 8] });
  }
  if (plan.financialProjections?.startupCosts?.length) {
    const scBody = [[
      { text: 'Item', bold: true, fillColor: '#f9fafb', fontSize: 10, color: GRAY },
      { text: 'Amount', bold: true, fillColor: '#f9fafb', fontSize: 10, color: GRAY, alignment: 'right' },
    ]];
    plan.financialProjections.startupCosts.forEach((c: any) => {
      scBody.push([{ text: c.item || '', fontSize: 10 }, { text: c.amount || '', alignment: 'right', fontSize: 10 }]);
    });
    content.push(
      { text: 'Startup Costs', bold: true, fontSize: 11, color: GRAY, margin: [0, 8, 0, 6] },
      {
        table: { headerRows: 1, widths: ['*', 'auto'], body: scBody },
        layout: { hLineWidth: (i: number) => i <= 1 ? 1 : 0.5, vLineWidth: () => 0, hLineColor: (i: number) => i <= 1 ? '#d1d5db' : '#f3f4f6', paddingLeft: () => 10, paddingRight: () => 10, paddingTop: () => 5, paddingBottom: () => 5 },
        margin: [0, 0, 0, 8],
      },
    );
  }
  if (plan.financialProjections?.fundingNeeded) {
    content.push(box('Funding Requirement', plan.financialProjections.fundingNeeded, GREEN_LIGHT, GREEN));
  }
  content.push({ text: '', pageBreak: 'after' });

  /* ---------- 6. OPERATIONS PLAN ---------- */
  content.push(...heading(6, 'Operations Plan'));
  if (plan.operationsPlan?.businessModel) {
    content.push({ text: 'Business Model', bold: true, fontSize: 11, color: '#111827', margin: [0, 0, 0, 4] });
    content.push({ text: plan.operationsPlan.businessModel, fontSize: 10, color: GRAY, lineHeight: 1.5, margin: [0, 0, 0, 12] });
  }
  if (plan.operationsPlan?.teamStructure) {
    content.push({ text: 'Team Structure', bold: true, fontSize: 11, color: '#111827', margin: [0, 0, 0, 4] });
    content.push({ text: plan.operationsPlan.teamStructure, fontSize: 10, color: GRAY, lineHeight: 1.5, margin: [0, 0, 0, 12] });
  }
  if (plan.operationsPlan?.technology) {
    content.push({ text: 'Technology', bold: true, fontSize: 11, color: '#111827', margin: [0, 0, 0, 4] });
    content.push({ text: plan.operationsPlan.technology, fontSize: 10, color: GRAY, lineHeight: 1.5, margin: [0, 0, 0, 12] });
  }
  if (plan.operationsPlan?.keyMilestones?.length) {
    content.push({ text: 'Key Milestones', bold: true, fontSize: 11, color: '#111827', margin: [0, 4, 0, 6] });
    const msBody = [[
      { text: 'Timeline', bold: true, fillColor: '#f9fafb', fontSize: 10, color: BLUE },
      { text: 'Milestone', bold: true, fillColor: '#f9fafb', fontSize: 10, color: GRAY },
    ]];
    plan.operationsPlan.keyMilestones.forEach((m: any) => {
      msBody.push([{ text: m.timeline || '', fontSize: 10, color: BLUE, bold: true }, { text: m.milestone || '', fontSize: 10, color: GRAY }]);
    });
    content.push({
      table: { headerRows: 1, widths: ['auto', '*'], body: msBody },
      layout: { hLineWidth: (i: number) => i <= 1 ? 1 : 0.5, vLineWidth: () => 0, hLineColor: (i: number) => i <= 1 ? '#d1d5db' : '#f3f4f6', paddingLeft: () => 10, paddingRight: () => 10, paddingTop: () => 6, paddingBottom: () => 6 },
    });
  }
  content.push({ text: '', pageBreak: 'after' });

  /* ---------- 7. RISK ANALYSIS ---------- */
  content.push(...heading(7, 'Risk Analysis'));
  (plan.riskAnalysis?.risks || []).forEach((r: any) => content.push(riskCard(r)));

  /* ---------- FOOTER ---------- */
  content.push(
    { text: '', margin: [0, 20, 0, 0] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }] },
    { text: `Generated by BizPlan Genius â  ${date}`, fontSize: 9, color: GRAY_MUTED, alignment: 'center', margin: [0, 10, 0, 0] },
    { text: 'AI-Powered Business Plans with Real Market Research', fontSize: 8, color: '#d1d5db', alignment: 'center', margin: [0, 2, 0, 0] },
  );

  return {
    pageSize: 'A4' as const,
    pageMargins: [40, 60, 40, 50] as [number, number, number, number],
    header: (currentPage: number) => {
      if (currentPage === 1) return null;
      return {
        columns: [
          { text: busiæW74æÖRÂföçE6¦S¢Â6öÆ÷#¢u$ôÕUDTBÂÖ&vã¢³CÂ#ÂÂÒÒÀ¢²FWC¢t&¥ÆâvVæW2rÂföçE6¦S¢Â6öÆ÷#¢u$ôÕUDTBÂÆvæÖVçC¢w&vBrÂÖ&vã¢³Â#ÂCÂÒÒÀ¢ÒÀ¢Ó°¢ÒÀ¢fö÷FW#¢7W'&VçEvS¢çVÖ&W"ÂvT6÷VçC¢çVÖ&W"Óâ°¢b7W'&VçEvRÓÓÒ&WGW&âçVÆÃ°¢&WGW&â²FWC¢vRG¶7W'&VçEvWÒöbG·vT6÷VçGÖÂÆvæÖVçC¢v6VçFW"rÂföçE6¦S¢Â6öÆ÷#¢u$ôÕUDTBÂÖ&vã¢³ÂÂÂÒÓ°¢ÒÀ¢6öçFVçBÀ¢FVfVÇE7GÆS¢²föçC¢u&ö&÷FòrÂföçE6¦S¢Â6öÆ÷#¢u$ÂÆæTVvC¢ã2ÒÀ¢Ó°§Ð ¢ò¢ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÐ¢tR4ôÕôäTå@¢ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒ¢ð ¦W÷'BFVfVÇBgVæ7Föâ7V66W75vR°¢6öç7B·7FGW2Â6WE7FGW5ÒÒW6U7FFSÂvÆöFærrÂvvVæW&FærrÂvFöæRrÂvW'&÷"sâvÆöFærr°¢6öç7B·ÆâÂ6WEÆåÒÒW6U7FFSÄ'W6æW75ÆâÂçVÆÃâçVÆÂ°¢6öç7B¶'W6æW74æÖRÂ6WD'W6æW74æÖUÒÒW6U7FFRrr°¢6öç7B·&öw&W72Â6WE&öw&W75ÒÒW6U7FFR°¢6öç7B4fWF6VBÒW6U&VbfÇ6R° ¢W6TVffV7BÓâ°¢b4fWF6VBæ7W'&VçB&WGW&ã°¢4fWF6VBæ7W'&VçBÒG'VS° ¢6öç7B&×2ÒæWrU$Å6V&6&×2væF÷ræÆö6Föâç6V&6°¢6öç7B6W76öäBÒ&×2ævWBw6W76öåöBr° ¢b6W76öäB°¢6WE7FGW2vW'&÷"r°¢&WGW&ã°¢Ð ¢6WE7FGW2vvVæW&Færr°¢6öç7BçFW'fÂÒ6WDçFW'fÂÓâ°¢6WE&öw&W72&WbÓâÖFæÖâ&Wb²ÖFç&æFöÒ¢Â°¢ÒÂS° ¢fWF6röögVÆfÆÂrÂ²ÖWFöC¢uõ5BrÂVFW'3¢²t6öçFVçBÕGRs¢vÆ6Föâö§6öârÒÂ&öG¢¥4ôâç7G&ævg²6W76öäBÒÒ¢çFVâ&W2Óâ&W2æ§6öâ¢çFVâFFÓâ°¢6ÆV$çFW'fÂçFW'fÂ°¢bFFçÆâ°¢6WE&öw&W72°¢6WD'W6æW74æÖRFFæ'W6æW74æÖRÇÂt'W6æW72Æâr°¢6WEFÖV÷WBÓâ°¢6WEÆâFFçÆâ°¢6WE7FGW2vFöæRr°¢ÒÂS°¢ÒVÇ6R°¢6WE7FGW2vW'&÷"r°¢Ð¢Ò¢æ6F6Óâ°¢6ÆV$çFW'fÂçFW'fÂ°¢6WE7FGW2vW'&÷"r°¢Ò°¢ÒÂµÒ° ¢7æ2gVæ7FöâæFÆTF÷væÆöB°¢bÆâ&WGW&ã°¢6öç7B'FâÒFö7VÖVçBævWDVÆVÖVçD'BvF÷væÆöBÖ'Fâr°¢6öç7BÖö&ÆT'FâÒFö7VÖVçBævWDVÆVÖVçD'BvF÷væÆöBÖ'FâÖÖö&ÆRr°¢6öç7B6WDÆöFærÒÆöFæs¢&ööÆVâÓâ°¢¶'FâÂÖö&ÆT'FåÒæf÷$V6"Óâ°¢b"&WGW&ã°¢bÆöFær²"çFWD6öçFVçBÒ~(û2vVæW&FærDbâââs²"ç6WDGG&'WFRvF6&ÆVBrÂwG'VRr²Ð¢VÇ6R²"çFWD6öçFVçBÒ	ù:RF÷væÆöB2Dbs²"ç&VÖ÷fTGG&'WFRvF6&ÆVBr²Ð¢Ò°¢Ó°¢6WDÆöFærG'VR°¢G'°¢vBÆöEFdÖ¶R°¢6öç7BFö4FVbÒ'VÆEDbÆâÂ'W6æW74æÖR°¢6öç7B6fTæÖRÒ'W6æW74æÖRç&WÆ6Rõµæ×¤Õ£ÓÒörÂrrç&WÆ6RõÇ2²örÂrÒr°¢væF÷r2ççFdÖ¶Ræ7&VFUFbFö4FVbæF÷væÆöBG·6fTæÖWÒÔ'W6æW72ÕÆâçFf°¢Ò6F6R°¢6öç6öÆRæW'&÷"uDbW'&÷#¢rÂR°¢ÆW'BtfÆVBFòvVæW&FRDbâÆV6RG'vââr°¢ÒfæÆÇ°¢6WDÆöFærfÇ6R°¢Ð¢Ð ¢ò¢ÒÒÒÒÆöFær7FFRÒÒÒÒ¢ð¢b7FGW2ÓÓÒvÆöFærrÇÂ7FGW2ÓÓÒvvVæW&Færr°¢&WGW&â¢ÆFb6Æ74æÖSÒ&ÖâÖ×67&VVâ&rÖw&ÓSfÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"ÓB#à¢ÆFb6Æ74æÖSÒ&Ö×rÖÖBrÖgVÆÂFWBÖ6VçFW"#à¢ÆFb6Æ74æÖSÒ&Ö"Ó#à¢ÆFb6Æ74æÖSÒ'rÓbÓb×ÖWFòÖ"ÓB&÷VæFVBÖgVÆÂ&rÖ'&æBÓfÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"#à¢Ç7fr6Æ74æÖSÒ'rÓÓFWBÖ'&æBÓcæÖFR×7â"fÆÃÒ&æöæR"fWt&÷Ò##B#B#à¢Æ6&6ÆR6Æ74æÖSÒ&÷6GÓ#R"7Ò#""7Ò#""#Ò#"7G&ö¶SÒ&7W'&VçD6öÆ÷""7G&ö¶UvGFÒ#B"óà¢ÇF6Æ74æÖSÒ&÷6GÓsR"fÆÃÒ&7W'&VçD6öÆ÷""CÒ$ÓB&Óc3Rã3s2Rã3s2&G¢"óà¢Â÷7fsà¢ÂöFcà¢Æ6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBÖ"Ó"#ävVæW&Fær÷W"'W6æW72ÆãÂöà¢Ç6Æ74æÖSÒ'FWBÖw&Óc#ä÷W"2&W6V&6ær÷W"6ö×WFF÷'2æBæÇ¦ær÷W"Ö&¶WBââãÂ÷à¢ÂöFcà¢ÆFb6Æ74æÖSÒ'rÖgVÆÂ&rÖw&Ó#&÷VæFVBÖgVÆÂÓ2Ö"Ó2#à¢ÆF`¢6Æ74æÖSÒ&&rÖ'&æBÓcÓ2&÷VæFVBÖgVÆÂG&ç6FöâÖÆÂGW&FöâÓS ¢7GÆS×·²vGF¢G·&öw&W77ÒV×Ð¢óà¢ÂöFcà¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&ÓS#à¢·&öw&W72Â3òu&W6V&6ær6ö×WFF÷'2âââr ¢&öw&W72ÂcòtæÇ¦ærÖ&¶WBFFâââr ¢&öw&W72Âòt'VÆFærfææ6Â&ö¦V7Föç2âââr ¢tfæÆ¦ær÷W"'W6æW72ÆââââwÐ¢Â÷à¢ÂöFcà¢ÂöFcà¢°¢Ð ¢ò¢ÒÒÒÒW'&÷"7FFRÒÒÒÒ¢ð¢b7FGW2ÓÓÒvW'&÷"r°¢&WGW&â¢ÆFb6Æ74æÖSÒ&ÖâÖ×67&VVâ&rÖw&ÓSfÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"ÓB#à¢ÆFb6Æ74æÖSÒ&Ö×rÖÖBrÖgVÆÂFWBÖ6VçFW"#à¢ÆFb6Æ74æÖSÒ'FWBÓWÂÖ"ÓB#î)ªûóÂöFcà¢Æ6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBÖ"Ó"#å6öÖWFærvVçBw&öæsÂöà¢Ç6Æ74æÖSÒ'FWBÖw&ÓcÖ"Ób#à¢Föâf÷3·Bv÷''(	B÷W"ÖVçB26fRâÆV6R6öçF7BW2æBvRf÷3¶ÆÂvVæW&FR÷W"ÆâÖçVÆÇà¢Â÷à¢Æ&VcÒ&ÖÇFó§7W÷'D&§ÆævVæW2æ6öÒ"6Æ74æÖSÒ&æÆæRÖ&Æö6²ÓbÓ2&rÖ'&æBÓcFWB×vFRföçB×6VÖ&öÆB&÷VæFVBÖÆr#à¢6öçF7B7W÷'@¢Âöà¢ÂöFcà¢ÂöFcà¢°¢Ð ¢bÆâ&WGW&âçVÆÃ° ¢6öç7BvVæW&FVDFFRÒæWrFFRçFôÆö6ÆTFFU7G&ærvVâÕU2rÂ²V#¢vçVÖW&2rÂÖöçF¢vÆöærrÂF¢vçVÖW&2rÒ° ¢&WGW&â¢ÆFb6Æ74æÖSÒ&ÖâÖ×67&VVâ&rÖw&ÓS#à¢²ò¢7F6·VFW"¢÷Ð¢ÆVFW"6Æ74æÖSÒ&&r×vFR&÷&FW"Ö"&÷&FW"Öw&Ó7F6·F÷Ó¢ÓS#à¢ÆFb6Æ74æÖSÒ&Ö×rÓWÂ×ÖWFòÓBÓbfÆWFV×2Ö6VçFW"§W7FgÖ&WGvVVâ#à¢Æ&VcÒ"ò"6Æ74æÖSÒ'FWB×ÂföçBÖ&öÆBFWBÖw&FVçB#ä&¥ÆâvVæW3Âöà¢Æ'WGFöà¢CÒ&F÷væÆöBÖ'Fâ ¢öä6Æ6³×¶æFÆTF÷væÆöGÐ¢6Æ74æÖSÒ'ÓRÓ"ãR&rÖ'&æBÓcFWB×vFRföçB×6VÖ&öÆB&÷VæFVBÖÆr÷fW#¦&rÖ'&æBÓsG&ç6FöâFWB×6Ò ¢à¢	ù:RF÷væÆöB2D`¢Âö'WGFöãà¢ÂöFcà¢ÂöVFW#à ¢²ò¢Öâ6öçFVçB¢÷Ð¢ÆÖâ6Æ74æÖSÒ&Ö×rÓGÂ×ÖWFòÓBÓ"#à ¢²ò¢7V66W72&ææW"¢÷Ð¢ÆFb6Æ74æÖSÒ&&rÖ66VçBÓSó&÷&FW"&÷&FW"Ö66VçBÓSó#&÷VæFVBÓ'ÂÓbFWBÖ6VçFW"Ö"Ó#à¢ÆFb6Æ74æÖSÒ'FWBÓ7ÂÖ"Ó"#î)ÈSÂöFcà¢Æ6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWBÖ66VçBÓcÖ"Ó#å÷W"'W6æW72Æâ2&VGÂöà¢Ç6Æ74æÖSÒ'FWBÖw&Óc#å&WfWr÷W"Æâ&VÆ÷rÂFVâ6Æ6²gV÷C´F÷væÆöB2DbgV÷C²Fò6fRBFò÷W"6ö×WFW#Â÷à¢ÂöFcà ¢²ò¢ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒâUT5UDdR5TÔÔ%ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒ¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&&r×vFR&÷VæFVBÓ'Â&÷&FW"&÷&FW"Öw&ÓÓ6F÷r×6ÒÖ"Ó#à¢Æ"6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWBÖ'&æBÓsÖ"Ób"Ó2&÷&FW"Ö"&÷&FW"Öw&Ó#ãâWV7WFfR7VÖÖ'Âö#à¢Ç6Æ74æÖSÒ'FWBÖw&ÓsÆVFær×&VÆVBÖ"ÓBvFW76R×&RÖÆæR#ç·ÆâæWV7WFfU7VÖÖ'æ÷fW'fWwÓÂ÷à¢ÆFb6Æ74æÖSÒ&w&Bw&BÖ6öÇ2Ó6Ó¦w&BÖ6öÇ2Ó"vÓB×BÓb#à¢ÆFb6Æ74æÖSÒ'ÓB&rÖ'&æBÓS&÷VæFVB×Â#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖ'&æBÓsÖ"Ó#äÖ76öãÂ÷à¢Ç6Æ74æÖSÒ'FWBÖw&ÓsFWB×6Ò#ç·ÆâæWV7WFfU7VÖÖ'æÖ76öçÓÂ÷à¢ÂöFcà¢ÆFb6Æ74æÖSÒ'ÓB&rÖ'&æBÓS&÷VæFVB×Â#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖ'&æBÓsÖ"Ó#åf6öãÂ÷à¢Ç6Æ74æÖSÒ'FWBÖw&ÓsFWB×6Ò#ç·ÆâæWV7WFfU7VÖÖ'çf6öçÓÂ÷à¢ÂöFcà¢ÂöFcà¢ÆFb6Æ74æÖSÒ&×BÓBÓB&rÖ66VçBÓSóR&÷VæFVB×Â#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖ66VçBÓcÖ"Ó#åfÇVR&÷÷6FöãÂ÷à¢Ç6Æ74æÖSÒ'FWBÖw&ÓsFWB×6Ò#ç·ÆâæWV7WFfU7VÖÖ'çfÇVU&÷÷6FöçÓÂ÷à¢ÂöFcà¢·ÆâæWV7WFfU7VÖÖ'æ¶WÖWG&72bb¢ÆFb6Æ74æÖSÒ&×BÓB#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖw&ÓsÖ"Ó"#ä¶W&ö¦V7FVBÖWG&73Â÷à¢ÇVÂ6Æ74æÖSÒ'76R×Ó#à¢·ÆâæWV7WFfU7VÖÖ'æ¶WÖWG&72æÖÓ¢7G&ærÂ¢çVÖ&W"Óâ¢ÆÆ¶W×¶Ò6Æ74æÖSÒ&fÆWFV×2×7F'BvÓ"FWB×6ÒFWBÖw&Óc#à¢Ç7â6Æ74æÖSÒ'FWBÖ'&æBÓS×BÓãR#î)xóÂ÷7ãâ¶×Ð¢ÂöÆà¢Ð¢Â÷VÃà¢ÂöFcà¢Ð¢Â÷6V7Föãà ¢²ò¢ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒ"â4ôÕUDDõ"äÅ42ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒ¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&&r×vFR&÷VæFVBÓ'Â&÷&FW"&÷&FW"Öw&ÓÓ6F÷r×6ÒÖ"Ó#à¢Æ"6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWBÖ'&æBÓsÖ"Ób"Ó2&÷&FW"Ö"&÷&FW"Öw&Ó#ã"â6ö×WFF÷"æÇ63Âö#à¢Ç6Æ74æÖSÒ'FWBÖw&ÓsÆVFær×&VÆVBÖ"Ób#ç·Æâæ6ö×WFF÷$æÇ62æ÷fW'fWwÓÂ÷à¢ÆFb6Æ74æÖSÒ'76R×ÓB#à¢·Æâæ6ö×WFF÷$æÇ62æ6ö×WFF÷'3òæÖ3¢çÂ¢çVÖ&W"Óâ¢ÆFb¶W×¶Ò6Æ74æÖSÒ'ÓR&÷&FW"&÷&FW"Öw&Ó&÷VæFVB×Â#à¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"§W7FgÖ&WGvVVâÖ"Ó"#à¢Æ26Æ74æÖSÒ&föçBÖ&öÆBFWBÖw&Ó#ç¶2ææÖWÓÂö3à¢¶2ç&6ærbbÇ7â6Æ74æÖSÒ'FWB×6ÒFWBÖw&ÓS&rÖw&ÓSÓ2Ó&÷VæFVBÖgVÆÂ#ç¶2ç&6æwÓÂ÷7ãçÐ¢ÂöFcà¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&ÓcÖ"Ó2#ç¶2æFW67&FöçÓÂ÷à¢ÆFb6Æ74æÖSÒ&w&Bw&BÖ6öÇ2Ó"vÓ2#à¢ÆFcà¢Ç6Æ74æÖSÒ'FWB×2föçB×6VÖ&öÆBFWBÖw&VVâÓcÖ"Ó#å5E$TäuD3Â÷à¢¶2ç7G&VæwF3òæÖ3¢7G&ærÂ£¢çVÖ&W"Óâ¢Ç¶W×¶§Ò6Æ74æÖSÒ'FWB×2FWBÖw&Óc#â²·7ÓÂ÷à¢Ð¢ÂöFcà¢ÆFcà¢Ç6Æ74æÖSÒ'FWB×2föçB×6VÖ&öÆBFWB×&VBÓSÖ"Ó#åtT´äU54U3Â÷à¢¶2çvV¶æW76W3òæÖs¢7G&ærÂ£¢çVÖ&W"Óâ¢Ç¶W×¶§Ò6Æ74æÖSÒ'FWB×2FWBÖw&Óc#âÒ·wÓÂ÷à¢Ð¢ÂöFcà¢ÂöFcà¢ÂöFcà¢Ð¢ÂöFcà¢·Æâæ6ö×WFF÷$æÇ62æÖ&¶WDv2bb¢ÆFb6Æ74æÖSÒ&×BÓbÓB&rÖ66VçBÓSóR&÷VæFVB×Â#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖ66VçBÓcÖ"Ó"#äÖ&¶WBv2f×²÷÷'GVæFW3Â÷à¢·Æâæ6ö×WFF÷$æÇ62æÖ&¶WDv2æÖs¢7G&ærÂ¢çVÖ&W"Óâ¢Ç¶W×¶Ò6Æ74æÖSÒ'FWB×6ÒFWBÖw&ÓcÖ"Ó#î(i"¶wÓÂ÷à¢Ð¢ÂöFcà¢Ð¢Â÷6V7Föãà ¢²ò¢ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒ2âÔ$´UBäÅ42ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒ¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&&r×vFR&÷VæFVBÓ'Â&÷&FW"&÷&FW"Öw&ÓÓ6F÷r×6ÒÖ"Ó#à¢Æ"6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWBÖ'&æBÓsÖ"Ób"Ó2&÷&FW"Ö"&÷&FW"Öw&Ó#ã2âÖ&¶WBæÇ63Âö#à¢Ç6Æ74æÖSÒ'FWBÖw&ÓsÆVFær×&VÆVBÖ"ÓBvFW76R×&RÖÆæR#ç·ÆâæÖ&¶WDæÇ62ææGW7G'÷fW'fWwÓÂ÷à¢ÆFb6Æ74æÖSÒ&w&Bw&BÖ6öÇ2Ó6Ó¦w&BÖ6öÇ2Ó"vÓB×Ób#à¢ÆFb6Æ74æÖSÒ'ÓB&rÖ'&æBÓS&÷VæFVB×Â#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖ'&æBÓs#äÖ&¶WB6¦SÂ÷à¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&Ós×BÓ#ç·ÆâæÖ&¶WDæÇ62æÖ&¶WE6¦WÓÂ÷à¢ÂöFcà¢ÆFb6Æ74æÖSÒ'ÓB&rÖ'&æBÓS&÷VæFVB×Â#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖ'&æBÓs#äw&÷wF&FSÂ÷à¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&Ós×BÓ#ç·ÆâæÖ&¶WDæÇ62æw&÷wF&FWÓÂ÷à¢ÂöFcà¢ÂöFcà¢·ÆâæÖ&¶WDæÇ62çG&VæG2bb¢ÆFb6Æ74æÖSÒ&Ö"Ób#à¢Ç6Æ74æÖSÒ&föçB×6VÖ&öÆBFWBÖw&ÓsÖ"Ó"#ä¶WæGW7G'G&VæG3Â÷à¢·ÆâæÖ&¶WDæÇ62çG&VæG2æÖC¢7G&ærÂ¢çVÖ&W"Óâ¢Ç¶W×¶Ò6Æ74æÖSÒ'FWB×6ÒFWBÖw&ÓcÖ"Ó#ï	ù8·GÓÂ÷à¢Ð¢ÂöFcà¢Ð¢·ÆâæÖ&¶WDæÇ62çF&vWD7W7FöÖW%&öfÆRbb¢ÆFb6Æ74æÖSÒ'ÓR&÷&FW"&÷&FW"Öw&Ó&÷VæFVB×Â#à¢Ç6Æ74æÖSÒ&föçB×6VÖ&öÆBFWBÖw&ÓsÖ"Ó2#åF&vWB7W7FöÖW"&öfÆSÂ÷à¢ÆFb6Æ74æÖSÒ'76R×Ó"FWB×6Ò#à¢ÇãÇ7â6Æ74æÖSÒ&föçBÖÖVFVÒ#äFVÖöw&73£Â÷7ãâ·ÆâæÖ&¶WDæÇ62çF&vWD7W7FöÖW%&öfÆRæFVÖöw&77ÓÂ÷à¢ÇãÇ7â6Æ74æÖSÒ&föçBÖÖVFVÒ#å76öw&73£Â÷7ãâ·ÆâæÖ&¶WDæÇ62çF&vWD7W7FöÖW%&öfÆRç76öw&77ÓÂ÷à¢ÇãÇ7â6Æ74æÖSÒ&föçBÖÖVFVÒ#ä'Wær&Vf÷#£Â÷7ãâ·ÆâæÖ&¶WDæÇ62çF&vWD7W7FöÖW%&öfÆRæ'Wæt&Vf÷'ÓÂ÷à¢ÆFcà¢Ç7â6Æ74æÖSÒ&föçBÖÖVFVÒ#åâöçG3£Â÷7ãà¢·ÆâæÖ&¶WDæÇ62çF&vWD7W7FöÖW%&öfÆRçåöçG3òæÖ¢7G&ærÂ¢çVÖ&W"Óâ¢Ç¶W×¶Ò6Æ74æÖSÒ'FWBÖw&ÓcÖÂÓB#î(
"·ÓÂ÷à¢Ð¢ÂöFcà¢ÂöFcà¢ÂöFcà¢Ð¢Â÷6V7Föãà ¢²ò¢ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒBâÔ$´UDärb4ÄU25E$DTuÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒ¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&&r×vFR&÷VæFVBÓ'Â&÷&FW"&÷&FW"Öw&ÓÓ6F÷r×6ÒÖ"Ó#à¢Æ"6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWBÖ'&æBÓsÖ"Ób"Ó2&÷&FW"Ö"&÷&FW"Öw&Ó#ãBâÖ&¶WFærf×²6ÆW27G&FVwÂö#à¢ÆFb6Æ74æÖSÒ'ÓB&rÖ'&æBÓS&÷VæFVB×ÂÖ"Ób#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖ'&æBÓs#å÷6FöææsÂ÷à¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&Ós×BÓ#ç·ÆâæÖ&¶WFæu7G&FVwç÷6FöææwÓÂ÷à¢ÂöFcà¢·ÆâæÖ&¶WFæu7G&FVwæ6ææVÇ2bb¢ÆFb6Æ74æÖSÒ&Ö"Ób#à¢Ç6Æ74æÖSÒ&föçB×6VÖ&öÆBFWBÖw&ÓsÖ"Ó2#äÖ&¶WFær6ææVÇ3Â÷à¢ÆFb6Æ74æÖSÒ'76R×Ó2#à¢·ÆâæÖ&¶WFæu7G&FVwæ6ææVÇ2æÖ6¢çÂ¢çVÖ&W"Óâ¢ÆFb¶W×¶Ò6Æ74æÖSÒ'ÓB&÷&FW"&÷&FW"Öw&Ó&÷VæFVB×ÂfÆWFV×2×7F'B§W7FgÖ&WGvVVâ#à¢ÆFcà¢Ç6Æ74æÖSÒ&föçBÖÖVFVÒFWBÖw&Ó#ç¶6æ6ææVÇÓÂ÷à¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&Óc×BÓ#ç¶6ç7G&FVwÓÂ÷à¢¶6æW7FÖFVD42bbÇ6Æ74æÖSÒ'FWB×2FWBÖw&ÓS×BÓ#äW7Bâ43¢¶6æW7FÖFVD47ÓÂ÷çÐ¢ÂöFcà¢Ç7â6Æ74æÖS×¶FWB×2föçBÖÖVFVÒÓ"Ó&÷VæFVBÖgVÆÂfÆW×6&æ²ÓÖÂÓ2G¶6ç&÷&GÓÓÒtvròv&r×&VBÓSFWB×&VBÓcr¢6ç&÷&GÓÓÒtÖVFVÒròv&r×VÆÆ÷rÓSFWB×VÆÆ÷rÓcr¢v&rÖw&ÓSFWBÖw&ÓSwÖÓà¢¶6ç&÷&GÐ¢Â÷7ãà¢ÂöFcà¢Ð¢ÂöFcà¢ÂöFcà¢Ð¢·ÆâæÖ&¶WFæu7G&FVwæÆVæ6Æâbb¢ÆFb6Æ74æÖSÒ'ÓB&rÖ66VçBÓSóR&÷VæFVB×Â#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖ66VçBÓc#ãÔFÆVæ6ÆãÂ÷à¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&Ós×BÓvFW76R×&RÖÆæR#ç·ÆâæÖ&¶WFæu7G&FVwæÆVæ6ÆçÓÂ÷à¢ÂöFcà¢Ð¢Â÷6V7Föãà ¢²ò¢ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒRâdää4Â$ô¤T5Dôå2ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒ¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&&r×vFR&÷VæFVBÓ'Â&÷&FW"&÷&FW"Öw&ÓÓ6F÷r×6ÒÖ"Ó#à¢Æ"6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWBÖ'&æBÓsÖ"Ób"Ó2&÷&FW"Ö"&÷&FW"Öw&Ó#ãRâfææ6Â&ö¦V7Föç3Âö#à¢Ç6Æ74æÖSÒ'FWBÖw&ÓsÖ"Ób#ç·Æâæfææ6Å&ö¦V7Föç2ç&WfVçVTÖöFVÇÓÂ÷à¢ÆFb6Æ74æÖSÒ&÷fW&fÆ÷r×ÖWFòÖ"Ób#à¢ÇF&ÆR6Æ74æÖSÒ'rÖgVÆÂFWB×6Ò#à¢ÇFVCà¢ÇG"6Æ74æÖSÒ&&÷&FW"Ö"&÷&FW"Öw&Ó##à¢ÇF6Æ74æÖSÒ'FWBÖÆVgBÓ2ÓBföçB×6VÖ&öÆBFWBÖw&Óc&rÖw&ÓS#äÖWG&3Â÷Fà¢ÇF6Æ74æÖSÒ'FWB×&vBÓ2ÓBföçB×6VÖ&öÆBFWBÖw&Óc&rÖw&ÓS#åV"Â÷Fà¢ÇF6Æ74æÖSÒ'FWB×&vBÓ2ÓBföçB×6VÖ&öÆBFWBÖw&Óc&rÖw&ÓS#åV"#Â÷Fà¢ÇF6Æ74æÖSÒ'FWB×&vBÓ2ÓBföçB×6VÖ&öÆBFWBÖw&Óc&rÖw&ÓS#åV"3Â÷Fà¢Â÷G#à¢Â÷FVCà¢ÇF&öGà¢µ²w&WfVçVRrÂv6÷7G2rÂw&öfBrÂv7W7FöÖW'2uÒæÖÖWG&2Óâ¢ÇG"¶W×¶ÖWG&7Ò6Æ74æÖSÒ&&÷&FW"Ö"&÷&FW"Öw&ÓS#à¢ÇFB6Æ74æÖSÒ'Ó2ÓBföçBÖÖVFVÒ6FÆ¦R#ç¶ÖWG&7ÓÂ÷FCà¢ÇFB6Æ74æÖSÒ'Ó2ÓBFWB×&vB#ç·Æâæfææ6Å&ö¦V7Föç2çV#òå¶ÖWG&5×ÓÂ÷FCà¢ÇFB6Æ74æÖSÒ'Ó2ÓBFWB×&vB#ç·Æâæfææ6Å&ö¦V7Föç2çV##òå¶ÖWG&5×ÓÂ÷FCà¢ÇFB6Æ74æÖSÒ'Ó2ÓBFWB×&vBföçB×6VÖ&öÆBFWBÖ66VçBÓc#ç·Æâæfææ6Å&ö¦V7Föç2çV#3òå¶ÖWG&5×ÓÂ÷FCà¢Â÷G#à¢Ð¢Â÷F&öGà¢Â÷F&ÆSà¢ÂöFcà¢·Æâæfææ6Å&ö¦V7Föç2æ'&V´WfVåFÖVÆæRbb¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&ÓsÖ"ÓB#à¢Ç7â6Æ74æÖSÒ&föçB×6VÖ&öÆB#ä'&V²ÖWfVã£Â÷7ãâ·Æâæfææ6Å&ö¦V7Föç2æ'&V´WfVåFÖVÆæWÐ¢Â÷à¢Ð¢·Æâæfææ6Å&ö¦V7Föç2ç7F'GW6÷7G2bb¢ÆFb6Æ74æÖSÒ'ÓB&rÖw&ÓS&÷VæFVB×Â#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖw&ÓsÖ"Ó"#å7F'GW6÷7G3Â÷à¢·Æâæfææ6Å&ö¦V7Föç2ç7F'GW6÷7G2æÖ3¢çÂ¢çVÖ&W"Óâ¢ÆFb¶W×¶Ò6Æ74æÖSÒ&fÆW§W7FgÖ&WGvVVâFWB×6ÒFWBÖw&ÓcÓ&÷&FW"Ö"&÷&FW"Öw&ÓÆ7C¦&÷&FW"Ó#à¢Ç7ãç¶2æFV×ÓÂ÷7ãà¢Ç7â6Æ74æÖSÒ&föçBÖÖVFVÒ#ç¶2æÖ÷VçGÓÂ÷7ãà¢ÂöFcà¢Ð¢ÂöFcà¢Ð¢·Æâæfææ6Å&ö¦V7Föç2ægVæFætæVVFVBbb¢ÆFb6Æ74æÖSÒ&×BÓBÓB&rÖ66VçBÓSóR&÷VæFVB×Â#à¢Ç6Æ74æÖSÒ'FWB×6ÒföçB×6VÖ&öÆBFWBÖ66VçBÓc#ägVæFær&WV&VÖVçCÂ÷à¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&Ós×BÓ#ç·Æâæfææ6Å&ö¦V7Föç2ægVæFætæVVFVGÓÂ÷à¢ÂöFcà¢Ð¢Â÷6V7Föãà ¢²ò¢ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒbâõU$Dôå2ÄâÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒ¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&&r×vFR&÷VæFVBÓ'Â&÷&FW"&÷&FW"Öw&ÓÓ6F÷r×6ÒÖ"Ó#à¢Æ"6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWBÖ'&æBÓsÖ"Ób"Ó2&÷&FW"Ö"&÷&FW"Öw&Ó#ãbâ÷W&Föç2ÆãÂö#à¢ÆFb6Æ74æÖSÒ'76R×ÓBFWB×6ÒFWBÖw&Ós#à¢ÆFcà¢Ç6Æ74æÖSÒ&föçB×6VÖ&öÆBFWBÖw&ÓÖ"Ó#ä'W6æW72ÖöFVÃÂ÷à¢Ç6Æ74æÖSÒ'vFW76R×&RÖÆæR#ç·Æâæ÷W&Föç5Æâæ'W6æW74ÖöFVÇÓÂ÷à¢ÂöFcà¢ÆFcà¢Ç6Æ74æÖSÒ&föçB×6VÖ&öÆBFWBÖw&ÓÖ"Ó#åFVÒ7G'V7GW&SÂ÷à¢Ç6Æ74æÖSÒ'vFW76R×&RÖÆæR#ç·Æâæ÷W&Föç5ÆâçFVÕ7G'V7GW&WÓÂ÷à¢ÂöFcà¢ÆFcà¢Ç6Æ74æÖSÒ&föçB×6VÖ&öÆBFWBÖw&ÓÖ"Ó#åFV6æöÆöwÂ÷à¢Ç6Æ74æÖSÒ'vFW76R×&RÖÆæR#ç·Æâæ÷W&Föç5ÆâçFV6æöÆöwÓÂ÷à¢ÂöFcà¢ÂöFcà¢·Æâæ÷W&Föç5Æâæ¶WÖÆW7FöæW2bb¢ÆFb6Æ74æÖSÒ&×BÓb#à¢Ç6Æ74æÖSÒ&föçB×6VÖ&öÆBFWBÖw&ÓÖ"Ó2#ä¶WÖÆW7FöæW3Â÷à¢ÆFb6Æ74æÖSÒ'76R×Ó"#à¢·Æâæ÷W&Föç5Æâæ¶WÖÆW7FöæW2æÖÓ¢çÂ¢çVÖ&W"Óâ¢ÆFb¶W×¶Ò6Æ74æÖSÒ&fÆWFV×2×7F'BvÓ2FWB×6Ò#à¢Ç7â6Æ74æÖSÒ&föçBÖÖVFVÒFWBÖ'&æBÓcÖâ×rÕ³Ò#ç¶ÒçFÖVÆæWÓÂ÷7ãà¢Ç7â6Æ74æÖSÒ'FWBÖw&Óc#ç¶ÒæÖÆW7FöæWÓÂ÷7ãà¢ÂöFcà¢Ð¢ÂöFcà¢ÂöFcà¢Ð¢Â÷6V7Föãà ¢²ò¢ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒrâ$4²äÅ42ÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÒ¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&&r×vFR&÷VæFVBÓ'Â&÷&FW"&÷&FW"Öw&ÓÓ6F÷r×6ÒÖ"Ó#à¢Æ"6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWBÖ'&æBÓsÖ"Ób"Ó2&÷&FW"Ö"&÷&FW"Öw&Ó#ãrâ&6²æÇ63Âö#à¢ÆFb6Æ74æÖSÒ'76R×Ó2#à¢·Æâç&6´æÇ62ç&6·3òæÖ#¢çÂ¢çVÖ&W"Óâ¢ÆFb¶W×¶Ò6Æ74æÖSÒ'ÓB&÷&FW"&÷&FW"Öw&Ó&÷VæFVB×Â#à¢ÆFb6Æ74æÖSÒ&fÆWFV×2×7F'B§W7FgÖ&WGvVVâÖ"Ó"#à¢Ç6Æ74æÖSÒ&föçBÖÖVFVÒFWBÖw&Ó#ç·"ç&6·ÓÂ÷à¢ÆFb6Æ74æÖSÒ&fÆWvÓ"fÆW×6&æ²ÓÖÂÓB#à¢Ç7â6Æ74æÖS×¶FWB×2Ó"ÓãR&÷VæFVBÖgVÆÂG·"æÆ¶VÆööBÓÓÒtvròv&r×&VBÓSFWB×&VBÓcr¢"æÆ¶VÆööBÓÓÒtÖVFVÒròv&r×VÆÆ÷rÓSFWB×VÆÆ÷rÓcr¢v&rÖw&VVâÓSFWBÖw&VVâÓcwÖÓà¢·"æÆ¶VÆööGÐ¢Â÷7ãà¢ÂöFcà¢ÂöFcà¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&Óc#ãÇ7â6Æ74æÖSÒ&föçBÖÖVFVÒ#äÖFvFöã£Â÷7ãâ·"æÖFvFöçÓÂ÷à¢ÂöFcà¢Ð¢ÂöFcà¢Â÷6V7Föãà ¢²ò¢fö÷FW"¢÷Ð¢ÆFb6Æ74æÖSÒ'FWBÖ6VçFW"ÓFWB×6ÒFWBÖw&ÓC#à¢ÇävVæW&FVB'&¥ÆâvVæW2(	B×÷vW&VB'W6æW72Æç2vF&VÂÖ&¶WB&W6V&6Â÷à¢Ç6Æ74æÖSÒ&×BÓ#ävVæW&FVBöâ¶vVæW&FVDFFWÓÂ÷à¢ÂöFcà¢ÂöÖãà ¢²ò¢fÆöFærF÷væÆöB&"Öö&ÆR¢÷Ð¢ÆFb6Æ74æÖSÒ&fVB&÷GFöÒÓÆVgBÓ&vBÓ&r×vFRóR&6¶G&÷Ö&ÇW"×6Ò&÷&FW"×B&÷&FW"Öw&Ó#ÓB¢ÓS6Ó¦FFVâ#à¢Æ'WGFöà¢CÒ&F÷væÆöBÖ'FâÖÖö&ÆR ¢öä6Æ6³×¶æFÆTF÷væÆöGÐ¢6Æ74æÖSÒ'rÖgVÆÂÓ2&rÖ'&æBÓcFWB×vFRföçB×6VÖ&öÆB&÷VæFVB×Â÷fW#¦&rÖ'&æBÓsG&ç6FöâFWB×6Ò ¢à¢	ù:RF÷væÆöB2D`¢Âö'WGFöãà¢ÂöFcà¢ÂöFcà¢°§Ð 
