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
        { text: text || '—', fontSize: 10, color: GRAY, lineHeight: 1.4 },
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
  content.push(twoBoxes('Mission', plan.executiveSummary?.mission || '—', 'Vision', plan.executiveSummary?.vision || '—'));
  content.push(box('Value Proposition', plan.executiveSummary?.valueProposition || '—', GREEN_LIGHT, GREEN));
  if (plan.executiveSummary?.keyMetrics?.length) {
    content.push(
      { text: 'Key Projected Metrics', bold: true, fontSize: 11, color: GRAY, margin: [0, 12, 0, 6] },
      { ul: plan.executiveSummary.keyMetrics, fontSize: 10, color: GRAY, lineHeight: 1.4, margin: [0, 0, 0, 4] },
    );
  }
  content.push({ text: '', margin: [0, 16, 0, 0] });
  { /* Natural flow — no forced page break */ }

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
      box('Market Gaps & Opportunities', plan.competitorAnalysis.marketGaps.map((g: string) => `→ ${g}`).join('\n'), GREEN_LIGHT, GREEN),
    );
  }
  content.push({ text: '', margin: [0, 16, 0, 0] });

  /* ---------- 3. MARKET ANALYSIS ---------- */
  content.push(...heading(3, 'Market Analysis'));
  if (plan.marketAnalysis?.industryOverview) {
    content.push({ text: plan.marketAnalysis.industryOverview, fontSize: 10, color: GRAY, lineHeight: 1.5, margin: [0, 0, 0, 12] });
  }
  content.push(twoBoxes('Market Size', plan.marketAnalysis?.marketSize || '—', 'Growth Rate', plan.marketAnalysis?.growthRate || '—'));
  if (plan.marketAnalysis?.trends?.length) {
    content.push(
      { text: 'Key Industry Trends', bold: true, fontSize: 11, color: GRAY, margin: [0, 12, 0, 6] },
      ...plan.marketAnalysis.trends.map((t: string) => ({ text: `• ${t}`, fontSize: 10, color: GRAY, lineHeight: 1.4, margin: [8, 1, 0, 1] })),
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
      tcp.painPoints.forEach((p: string) => lines.push({ text: `• ${p}`, fontSize: 10, color: GRAY, margin: [12, 1, 0, 1] }));
    }
    content.push({
      unbreakable: true,
      margin: [0, 12, 0, 4],
      table: { widths: ['*'], body: [[{ stack: [{ text: 'Target Customer Profile', bold: true, fontSize: 12, color: '#111827', margin: [0, 0, 0, 8] }, ...lines] }]] },
      layout: { hLineWidth: () => 0.5, vLineWidth: () => 0.5, hLineColor: () => '#e5e7eb', vLineColor: () => '#e5e7eb', paddingLeft: () => 14, paddingRight: () => 14, paddingTop: () => 12, paddingBottom: () => 12 },
    });
  }
  content.push({ text: '', margin: [0, 16, 0, 0] });

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
  content.push({ text: '', margin: [0, 16, 0, 0] });

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
        [{ text: 'Revenue', fontSize: 10 }, { text: y1.revenue || '—', alignment: 'right', fontSize: 10 }, { text: y2.revenue || '—', alignment: 'right', fontSize: 10 }, { text: y3.revenue || '—', alignment: 'right', fontSize: 10, bold: true, color: GREEN }],
        [{ text: 'Costs', fontSize: 10 }, { text: y1.costs || '—', alignment: 'right', fontSize: 10 }, { text: y2.costs || '—', alignment: 'right', fontSize: 10 }, { text: y3.costs || '—', alignment: 'right', fontSize: 10 }],
        [{ text: 'Profit', fontSize: 10 }, { text: y1.profit || '—', alignment: 'right', fontSize: 10 }, { text: y2.profit || '—', alignment: 'right', fontSize: 10 }, { text: y3.profit || '—', alignment: 'right', fontSize: 10, bold: true, color: GREEN }],
        [{ text: 'Customers', fontSize: 10 }, { text: y1.customers || '—', alignment: 'right', fontSize: 10 }, { text: y2.customers || '—', alignment: 'right', fontSize: 10 }, { text: y3.customers || '—', alignment: 'right', fontSize: 10 }],
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
  content.push({ text: '', margin: [0, 16, 0, 0] });

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
  content.push({ text: '', margin: [0, 16, 0, 0] });

  /* ---------- 7. RISK ANALYSIS ---------- */
  content.push(...heading(7, 'Risk Analysis'));
  (plan.riskAnalysis?.risks || []).forEach((r: any) => content.push(riskCard(r)));

  /* ---------- FOOTER ---------- */
  content.push(
    { text: '', margin: [0, 20, 0, 0] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }] },
    { text: `Generated by BizPlan Genius — ${date}`, fontSize: 9, color: GRAY_MUTED, alignment: 'center', margin: [0, 10, 0, 0] },
    { text: 'AI-Powered Business Plans with Real Market Research', fontSize: 8, color: '#d1d5db', alignment: 'center', margin: [0, 2, 0, 0] },
  );

  return {
    pageSize: 'A4' as const,
    pageMargins: [40, 60, 40, 50] as [number, number, number, number],
    header: (currentPage: number) => {
      if (currentPage === 1) return null;
      return {
        columns: [
          { text: businessName, fontSize: 8, color: GRAY_MUTED, margin: [40, 20, 0, 0] },
          { text: 'BizPlan Genius', fontSize: 8, color: GRAY_MUTED, alignment: 'right', margin: [0, 20, 40, 0] },
        ],
      };
    },
    footer: (currentPage: number, pageCount: number) => {
      if (currentPage === 1) return null;
      return { text: `Page ${currentPage} of ${pageCount}`, alignment: 'center', fontSize: 8, color: GRAY_MUTED, margin: [0, 10, 0, 0] };
    },
    content,
    defaultStyle: { font: 'Roboto', fontSize: 10, color: GRAY, lineHeight: 1.3 },
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
        if (loading) { b.textContent = '⏳ Generating PDF...'; b.setAttribute('disabled', 'true'); }
        else { b.textContent = '📥 Download as PDF'; b.removeAttribute('disabled'); }
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

  /* ---- Loading state ---- */
  if (status === 'loading' || status === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Generating Your Business Plan</h1>
            <p className="text-gray-600">Our AI is researching your competitors and analyzing your market...</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div
              className="bg-brand-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">
            {progress < 30 ? 'Researching competitors...' :
             progress < 60 ? 'Analyzing market data...' :
             progress < 80 ? 'Building financial projections...' :
             'Finalizing your business plan...'}
          </p>
        </div>
      </div>
    );
  }

  /* ---- Error state ---- */
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
          <p className="text-gray-600 mb-6">
            Don&apos;t worry — your payment is safe. Please contact us and we&apos;ll generate your plan manually.
          </p>
          <a href="mailto:support@bizplangenius.com" className="inline-block px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg">
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
      {/* Print-friendly styles — hides web UI, shows clean document */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide all web UI elements */
          header, .print-hide, [class*="fixed bottom"], .bg-accent-500\\/10 { display: none !important; }
          /* Clean white background */
          body, .min-h-screen { background: white !important; }
          /* Remove shadows and borders from sections */
          section { box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 16px 0 !important; break-inside: avoid; }
          /* Clean page margins */
          @page { margin: 1in 0.75in; }
          /* Add document header for print */
          .print-header { display: block !important; text-align: center; padding-bottom: 12px; border-bottom: 2px solid #1d4ed8; margin-bottom: 24px; }
          .print-header .brand { font-size: 11px; color: #6b7280; }
          .print-header .date { font-size: 10px; color: #9ca3af; }
          /* Better page breaks */
          h2 { break-after: avoid; }
          .competitor-card, .channel-card, .risk-card { break-inside: avoid; }
        }
        @media not print {
          .print-header { display: none !important; }
        }
      `}} />

      {/* Print-only document header */}
      <div className="print-header">
        <p className="brand">BizPlan Genius — AI Business Plan Generator with Real Market Research</p>
        <p className="date">{generatedDate}</p>
      </div>

      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 print-hide">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <button
            id="download-btn"
            onClick={handleDownload}
            className="px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition text-sm"
          >
            📥 Download as PDF
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Success Banner */}
        <div className="bg-accent-500/10 border border-accent-500/20 rounded-2xl p-6 text-center mb-10 print-hide">
          <div className="text-3xl mb-2">✅</div>
          <h1 className="text-2xl font-bold text-accent-600 mb-1">Your Business Plan is Ready!</h1>
          <p className="text-gray-600">Review your plan below, then click &quot;Download as PDF&quot; to save it to your computer</p>
        </div>

        {/* ==================== 1. EXECUTIVE SUMMARY ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-brand-700 mb-6 pb-3 border-b border-gray-100">1. Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">{plan.executiveSummary.overview}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-brand-50 rounded-xl">
              <p className="text-sm font-semibold text-brand-700 mb-1">Mission</p>
              <p className="text-gray-700 text-sm">{plan.executiveSummary.mission}</p>
            </div>
            <div className="p-4 bg-brand-50 rounded-xl">
              <p className="text-sm font-semibold text-brand-700 mb-1">Vision</p>
              <p className="text-gray-700 text-sm">{plan.executiveSummary.vision}</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-accent-500/5 rounded-xl">
            <p className="text-sm font-semibold text-accent-600 mb-1">Value Proposition</p>
            <p className="text-gray-700 text-sm">{plan.executiveSummary.valueProposition}</p>
          </div>
          {plan.executiveSummary.keyMetrics && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Key Projected Metrics</p>
              <ul className="space-y-1">
                {plan.executiveSummary.keyMetrics.map((m: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-brand-500 mt-0.5">●</span> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ==================== 2. COMPETITOR ANALYSIS ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-brand-700 mb-6 pb-3 border-b border-gray-100">2. Competitor Analysis</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{plan.competitorAnalysis.overview}</p>
          <div className="space-y-4">
            {plan.competitorAnalysis.competitors?.map((c: any, i: number) => (
              <div key={i} className="p-5 border border-gray-100 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{c.name}</h3>
                  {c.pricing && <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{c.pricing}</span>}
                </div>
                <p className="text-sm text-gray-600 mb-3">{c.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-green-600 mb-1">STRENGTHS</p>
                    {c.strengths?.map((s: string, j: number) => (
                      <p key={j} className="text-xs text-gray-600">+ {s}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-1">WEAKNESSES</p>
                    {c.weaknesses?.map((w: string, j: number) => (
                      <p key={j} className="text-xs text-gray-600">- {w}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {plan.competitorAnalysis.marketGaps && (
            <div className="mt-6 p-4 bg-accent-500/5 rounded-xl">
              <p className="text-sm font-semibold text-accent-600 mb-2">Market Gaps &amp; Opportunities</p>
              {plan.competitorAnalysis.marketGaps.map((g: string, i: number) => (
                <p key={i} className="text-sm text-gray-600 mb-1">→ {g}</p>
              ))}
            </div>
          )}
        </section>

        {/* ==================== 3. MARKET ANALYSIS ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-brand-700 mb-6 pb-3 border-b border-gray-100">3. Market Analysis</h2>
          <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">{plan.marketAnalysis.industryOverview}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="p-4 bg-brand-50 rounded-xl">
              <p className="text-sm font-semibold text-brand-700">Market Size</p>
              <p className="text-sm text-gray-700 mt-1">{plan.marketAnalysis.marketSize}</p>
            </div>
            <div className="p-4 bg-brand-50 rounded-xl">
              <p className="text-sm font-semibold text-brand-700">Growth Rate</p>
              <p className="text-sm text-gray-700 mt-1">{plan.marketAnalysis.growthRate}</p>
            </div>
          </div>
          {plan.marketAnalysis.trends && (
            <div className="mb-6">
              <p className="font-semibold text-gray-700 mb-2">Key Industry Trends</p>
              {plan.marketAnalysis.trends.map((t: string, i: number) => (
                <p key={i} className="text-sm text-gray-600 mb-1">→ {t}</p>
              ))}
            </div>
          )}
          {plan.marketAnalysis.targetCustomerProfile && (
            <div className="p-5 border border-gray-100 rounded-xl">
              <p className="font-semibold text-gray-700 mb-3">Target Customer Profile</p>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Demographics:</span> {plan.marketAnalysis.targetCustomerProfile.demographics}</p>
                <p><span className="font-medium">Psychographics:</span> {plan.marketAnalysis.targetCustomerProfile.psychographics}</p>
                <p><span className="font-medium">Buying Behavior:</span> {plan.marketAnalysis.targetCustomerProfile.buyingBehavior}</p>
                <div>
                  <span className="font-medium">Pain Points:</span>
                  {plan.marketAnalysis.targetCustomerProfile.painPoints?.map((p: string, i: number) => (
                    <p key={i} className="text-gray-600 ml-4">• {p}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ==================== 4. MARKETING & SALES STRATEGY ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-brand-700 mb-6 pb-3 border-b border-gray-100">4. Marketing &amp; Sales Strategy</h2>
          <div className="p-4 bg-brand-50 rounded-xl mb-6">
            <p className="text-sm font-semibold text-brand-700">Positioning</p>
            <p className="text-sm text-gray-700 mt-1">{plan.marketingStrategy.positioning}</p>
          </div>
          {plan.marketingStrategy.channels && (
            <div className="mb-6">
              <p className="font-semibold text-gray-700 mb-3">Marketing Channels</p>
              <div className="space-y-3">
                {plan.marketingStrategy.channels.map((ch: any, i: number) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-xl flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{ch.channel}</p>
                      <p className="text-sm text-gray-600 mt-1">{ch.strategy}</p>
                      {ch.estimatedCAC && <p className="text-xs text-gray-500 mt-1">Est. CAC: {ch.estimatedCAC}</p>}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-3 ${ch.priority === 'High' ? 'bg-red-50 text-red-600' : ch.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-500'}`}>
                      {ch.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {plan.marketingStrategy.launchPlan && (
            <div className="p-4 bg-accent-500/5 rounded-xl">
              <p className="text-sm font-semibold text-accent-600">90-Day Launch Plan</p>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{plan.marketingStrategy.launchPlan}</p>
            </div>
          )}
        </section>

        {/* ==================== 5. FINANCIAL PROJECTIONS ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-brand-700 mb-6 pb-3 border-b border-gray-100">5. Financial Projections</h2>
          <p className="text-gray-700 mb-6">{plan.financialProjections.revenueModel}</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 bg-gray-50">Metric</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 bg-gray-50">Year 1</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 bg-gray-50">Year 2</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 bg-gray-50">Year 3</th>
                </tr>
              </thead>
              <tbody>
                {['revenue', 'costs', 'profit', 'customers'].map(metric => (
                  <tr key={metric} className="border-b border-gray-50">
                    <td className="py-3 px-4 font-medium capitalize">{metric}</td>
                    <td className="py-3 px-4 text-right">{plan.financialProjections.year1?.[metric]}</td>
                    <td className="py-3 px-4 text-right">{plan.financialProjections.year2?.[metric]}</td>
                    <td className="py-3 px-4 text-right font-semibold text-accent-600">{plan.financialProjections.year3?.[metric]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plan.financialProjections.breakEvenTimeline && (
            <p className="text-sm text-gray-700 mb-4">
              <span className="font-semibold">Break-even:</span> {plan.financialProjections.breakEvenTimeline}
            </p>
          )}
          {plan.financialProjections.startupCosts && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-2">Startup Costs</p>
              {plan.financialProjections.startupCosts.map((c: any, i: number) => (
                <div key={i} className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-100 last:border-0">
                  <span>{c.item}</span>
                  <span className="font-medium">{c.amount}</span>
                </div>
              ))}
            </div>
          )}
          {plan.financialProjections.fundingNeeded && (
            <div className="mt-4 p-4 bg-accent-500/5 rounded-xl">
              <p className="text-sm font-semibold text-accent-600">Funding Requirement</p>
              <p className="text-sm text-gray-700 mt-1">{plan.financialProjections.fundingNeeded}</p>
            </div>
          )}
        </section>

        {/* ==================== 6. OPERATIONS PLAN ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-brand-700 mb-6 pb-3 border-b border-gray-100">6. Operations Plan</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Business Model</p>
              <p className="whitespace-pre-line">{plan.operationsPlan.businessModel}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Team Structure</p>
              <p className="whitespace-pre-line">{plan.operationsPlan.teamStructure}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Technology</p>
              <p className="whitespace-pre-line">{plan.operationsPlan.technology}</p>
            </div>
          </div>
          {plan.operationsPlan.keyMilestones && (
            <div className="mt-6">
              <p className="font-semibold text-gray-900 mb-3">Key Milestones</p>
              <div className="space-y-2">
                {plan.operationsPlan.keyMilestones.map((m: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="font-medium text-brand-600 min-w-[80px]">{m.timeline}</span>
                    <span className="text-gray-600">{m.milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ==================== 7. RISK ANALYSIS ==================== */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-brand-700 mb-6 pb-3 border-b border-gray-100">7. Risk Analysis</h2>
          <div className="space-y-3">
            {plan.riskAnalysis.risks?.map((r: any, i: number) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">{r.risk}</p>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.likelihood === 'High' ? 'bg-red-50 text-red-600' : r.likelihood === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                      {r.likelihood}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600"><span className="font-medium">Mitigation:</span> {r.mitigation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8 text-sm text-gray-400 print-hide">
          <p>Generated by BizPlan Genius — AI-powered business plans with real market research</p>
          <p className="mt-1">Generated on {generatedDate}</p>
        </div>
      </main>

      {/* Floating Download Bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 z-50 sm:hidden print-hide">
        <button
          id="download-btn-mobile"
          onClick={handleDownload}
          className="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition text-sm"
        >
          📥 Download as PDF
        </button>
      </div>
    </div>
  );
}
