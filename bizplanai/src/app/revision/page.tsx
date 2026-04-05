'use client';

import { useState } from 'react';

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

export default function RevisionPage() {
  const [revisionNotes, setRevisionNotes] = useState('');
  const [status, setStatus] = useState<'form' | 'loading' | 'done' | 'error'>('form');
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [businessName, setBusinessName] = useState('');
  const [progress, setProgress] = useState(0);

  const getSessionId = () => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('session_id') || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionId = getSessionId();
    if (!sessionId) { setError('Missing session ID. Please use the revision link from your order confirmation.'); return; }
    if (!revisionNotes.trim()) { setError('Please describe what changes you want.'); return; }
    setStatus('loading');
    setError('');
    setProgress(0);
    const interval = setInterval(() => setProgress(prev => Math.min(prev + Math.random() * 6, 90)), 600);
    try {
      const res = await fetch('/api/revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, revisionNotes: revisionNotes.trim() }),
      });
      const data = await res.json();
      clearInterval(interval);
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setStatus('error'); return; }
      if (data.plan) {
        setProgress(100);
        setBusinessName(data.businessName || 'Business Plan');
        setTimeout(() => { setPlan(data.plan); setStatus('done'); }, 500);
      } else { setError('Failed to generate revised plan.'); setStatus('error'); }
    } catch { clearInterval(interval); setError('Connection error. Please try again.'); setStatus('error'); }
  };

  async function handleDownload() {
    if (!plan) return;
    try {
      await loadPdfMake();
      const safeName = businessName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
      const docDef: any = {
        pageSize: 'A4',
        pageMargins: [40, 50, 40, 50],
        content: [
          { text: businessName, fontSize: 22, bold: true, color: '#1a1a2e', alignment: 'center', margin: [0, 0, 0, 5] },
          { text: 'REVISED BUSINESS PLAN', fontSize: 10, color: '#16537e', alignment: 'center', characterSpacing: 2, margin: [0, 0, 0, 5] },
          { text: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), fontSize: 9, color: '#888', alignment: 'center', margin: [0, 0, 0, 20] },
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, lineColor: '#16537e' }], margin: [0, 0, 0, 15] },
          { text: '1. EXECUTIVE SUMMARY', fontSize: 13, bold: true, color: '#16537e', margin: [0, 10, 0, 8] },
          { text: plan.executiveSummary?.overview || '', fontSize: 10, color: '#2d2d2d', lineHeight: 1.5, margin: [0, 0, 0, 6] },
          { text: 'Mission: ' + (plan.executiveSummary?.mission || ''), fontSize: 10, color: '#555', margin: [0, 0, 0, 4] },
          { text: 'Vision: ' + (plan.executiveSummary?.vision || ''), fontSize: 10, color: '#555', margin: [0, 0, 0, 4] },
          { text: 'Value Proposition: ' + (plan.executiveSummary?.valueProposition || ''), fontSize: 10, color: '#555', margin: [0, 0, 0, 10] },
          { text: '2. COMPETITOR ANALYSIS', fontSize: 13, bold: true, color: '#16537e', margin: [0, 10, 0, 8], pageBreak: 'before' },
          { text: plan.competitorAnalysis?.overview || '', fontSize: 10, color: '#2d2d2d', lineHeight: 1.5, margin: [0, 0, 0, 8] },
          ...(plan.competitorAnalysis?.competitors || []).map((c: any) => ({ text: c.name + ': ' + (c.description || '') + ' (Pricing: ' + (c.pricing || 'N/A') + ')', fontSize: 10, color: '#555', margin: [0, 0, 0, 4] })),
          { text: '3. MARKET ANALYSIS', fontSize: 13, bold: true, color: '#16537e', margin: [0, 15, 0, 8], pageBreak: 'before' },
          { text: plan.marketAnalysis?.industryOverview || '', fontSize: 10, color: '#2d2d2d', lineHeight: 1.5, margin: [0, 0, 0, 6] },
          { text: 'Market Size: ' + (plan.marketAnalysis?.marketSize || ''), fontSize: 10, color: '#555', margin: [0, 0, 0, 4] },
          { text: '4. MARKETING STRATEGY', fontSize: 13, bold: true, color: '#16537e', margin: [0, 15, 0, 8], pageBreak: 'before' },
          { text: 'Positioning: ' + (plan.marketingStrategy?.positioning || ''), fontSize: 10, color: '#2d2d2d', lineHeight: 1.5, margin: [0, 0, 0, 6] },
          { text: '5. FINANCIAL PROJECTIONS', fontSize: 13, bold: true, color: '#16537e', margin: [0, 15, 0, 8], pageBreak: 'before' },
          { text: plan.financialProjections?.revenueModel || '', fontSize: 10, color: '#2d2d2d', lineHeight: 1.5, margin: [0, 0, 0, 6] },
          { table: { headerRows: 1, widths: ['*', 'auto', 'auto', 'auto'], body: [
            ['Metric', 'Year 1', 'Year 2', 'Year 3'].map(h => ({ text: h, bold: true, fontSize: 9, color: '#16537e' })),
            ['Revenue', plan.financialProjections?.year1?.revenue, plan.financialProjections?.year2?.revenue, plan.financialProjections?.year3?.revenue].map(v => ({ text: v || '\u2014', fontSize: 10 })),
            ['Costs', plan.financialProjections?.year1?.costs, plan.financialProjections?.year2?.costs, plan.financialProjections?.year3?.costs].map(v => ({ text: v || '\u2014', fontSize: 10 })),
            ['Net Profit', plan.financialProjections?.year1?.profit, plan.financialProjections?.year2?.profit, plan.financialProjections?.year3?.profit].map(v => ({ text: v || '\u2014', fontSize: 10, bold: true })),
          ]}, margin: [0, 0, 0, 10] },
          { text: '6. OPERATIONS PLAN', fontSize: 13, bold: true, color: '#16537e', margin: [0, 15, 0, 8], pageBreak: 'before' },
          { text: plan.operationsPlan?.businessModel || '', fontSize: 10, color: '#2d2d2d', lineHeight: 1.5, margin: [0, 0, 0, 6] },
          { text: '7. RISK ANALYSIS', fontSize: 13, bold: true, color: '#16537e', margin: [0, 15, 0, 8], pageBreak: 'before' },
          ...(plan.riskAnalysis?.risks || []).map((r: any) => ({ text: r.risk + ' (' + r.likelihood + ') \u2014 Mitigation: ' + r.mitigation, fontSize: 10, color: '#555', margin: [0, 0, 0, 6] })),
          { text: '', margin: [0, 20, 0, 0] },
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#ccc' }] },
          { text: 'Revised plan generated by BizPlan Genius \u2014 bizplangenius.com', fontSize: 8, color: '#888', alignment: 'center', margin: [0, 10, 0, 0] },
        ],
        defaultStyle: { font: 'Roboto', fontSize: 10, color: '#2d2d2d' },
      };
      (window as any).pdfMake.createPdf(docDef).download(safeName + '-Revised-Business-Plan.pdf');
    } catch (e) { console.error('PDF error:', e); alert('Failed to generate PDF. Please try again.'); }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
            <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Revising Your Business Plan</h1>
          <p className="text-gray-500">Incorporating your feedback and regenerating with updated research...</p>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mt-6 mb-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out" style={{ width: progress + '%' }} />
          </div>
          <p className="text-sm text-gray-400">{progress < 30 ? 'Applying your changes...' : progress < 60 ? 'Re-researching market data...' : progress < 85 ? 'Rebuilding your plan...' : 'Almost ready...'}</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Revision Not Available</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => { setStatus('form'); setError(''); }} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm">Try Again</button>
          <p className="mt-4"><a href="mailto:support@bizplangenius.com" className="text-sm text-gray-500 hover:text-gray-700">Contact Support</a></p>
        </div>
      </div>
    );
  }

  if (status === 'done' && plan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-lg font-bold text-gray-900"><span className="text-blue-600">BizPlan</span> Genius</a>
            <button onClick={handleDownload} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Download Revised PDF
            </button>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 sm:p-8 text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Revised Plan is Ready</h1>
            <p className="text-gray-500 max-w-lg mx-auto">We&apos;ve incorporated your feedback. Download the updated PDF below.</p>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{businessName}</h2>
            <p className="text-sm text-gray-400 mt-1">Revised \u2014 {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Executive Summary */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
              Executive Summary
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5 whitespace-pre-line text-sm">{plan.executiveSummary?.overview}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">Mission</p><p className="text-gray-700 text-sm">{plan.executiveSummary?.mission}</p></div>
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">Vision</p><p className="text-gray-700 text-sm">{plan.executiveSummary?.vision}</p></div>
            </div>
          </section>

          {/* Competitors */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
              Competitor Analysis
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5 text-sm">{plan.competitorAnalysis?.overview}</p>
            <div className="space-y-3">
              {plan.competitorAnalysis?.competitors?.map((c: any, i: number) => (
                <div key={i} className="p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{c.name}</h3>
                    {c.pricing && <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full">{c.pricing}</span>}
                  </div>
                  <p className="text-xs text-gray-500">{c.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Financials */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">5</span>
              Financial Projections
            </h2>
            <p className="text-gray-600 mb-5 text-sm">{plan.financialProjections?.revenueModel}</p>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Metric</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Year 1</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Year 2</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Year 3</th>
                </tr></thead>
                <tbody>
                  {['revenue', 'costs', 'profit', 'customers'].map((m, idx) => (
                    <tr key={m} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="py-3 px-4 font-medium text-gray-700 capitalize">{m === 'profit' ? 'Net Profit' : m}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{plan.financialProjections?.year1?.[m]}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{plan.financialProjections?.year2?.[m]}</td>
                      <td className="py-3 px-4 text-right font-semibold text-blue-600">{plan.financialProjections?.year3?.[m]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Download CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-center text-white">
            <h3 className="text-lg font-bold mb-2">Download your revised plan</h3>
            <p className="text-blue-100 text-sm mb-4">Your updated business plan is ready as a professional PDF.</p>
            <button onClick={handleDownload} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition text-sm shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Download Revised Business Plan (PDF)
            </button>
          </div>
          <div className="text-center py-8 text-xs text-gray-400"><p>Revised plan by BizPlan Genius \u2014 bizplangenius.com</p></div>
        </main>
      </div>
    );
  }

  /* ---- Form state ---- */
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500">Free Revision</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Request Your Free Revision</h1>
          <p className="text-gray-600 text-lg">Tell us what you&apos;d like changed. We&apos;ll regenerate your entire business plan with your feedback.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">What would you like changed? *</label>
            <textarea required rows={6} value={revisionNotes} onChange={e => setRevisionNotes(e.target.value)}
              placeholder={`Be as specific as possible. Examples:\n\u2022 Focus more on the B2B market instead of B2C\n\u2022 Add more competitors in the organic food space\n\u2022 Increase revenue projections \u2014 we have $100K in pre-orders\n\u2022 Change the location to San Francisco\n\u2022 Make the marketing strategy focus on TikTok and Instagram`}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            />
            <p className="text-xs text-gray-400 mt-1.5">The more detail you provide, the better your revision will be.</p>
          </div>
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          <div className="pt-4 border-t border-gray-100">
            <button type="submit" className="w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/25 text-lg">
              Generate Revised Plan \u2014 Free
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">Pro plan includes 1 free revision. This will regenerate your entire plan.</p>
          </div>
        </form>
      </main>
    </div>
  );
}
