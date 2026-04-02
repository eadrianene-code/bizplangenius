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

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'generating' | 'done' | 'error'>('loading');
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
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

    // Start progress animation
    setStatus('generating');
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 8, 90));
    }, 500);

    // Fetch session data and generate plan
    fetch('/api/fulfill', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) })
      .then(res => res.json())
      .then(data => {
        clearInterval(interval);
        if (data.plan) {
          setProgress(100);
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

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
          <p className="text-gray-600 mb-6">
            Don't worry — your payment is safe. Please contact us and we'll generate your plan manually.
          </p>
          <a href="mailto:support@bizplangenius.com" className="inline-block px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition text-sm"
          >
            Download as PDF
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-10 print:space-y-6" id="business-plan">
        {/* Success Banner */}
        <div className="bg-accent-500/10 border border-accent-500/20 rounded-2xl p-6 text-center print:hidden">
          <div className="text-3xl mb-2">✅</div>
          <h1 className="text-2xl font-bold text-accent-600 mb-1">Your Business Plan is Ready!</h1>
          <p className="text-gray-600">Click "Download as PDF" above to save your plan, or use Ctrl+P / Cmd+P</p>
        </div>

        {/* Executive Summary */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm print:shadow-none print:border-0">
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

        {/* Competitor Analysis */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm print:shadow-none print:border-0">
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
              <p className="text-sm font-semibold text-accent-600 mb-2">Market Gaps & Opportunities</p>
              {plan.competitorAnalysis.marketGaps.map((g: string, i: number) => (
                <p key={i} className="text-sm text-gray-600 mb-1">→ {g}</p>
              ))}
            </div>
          )}
        </section>

        {/* Market Analysis */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm print:shadow-none print:border-0">
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
                <p key={i} className="text-sm text-gray-600 mb-1">📈 {t}</p>
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

        {/* Marketing Strategy */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm print:shadow-none print:border-0">
          <h2 className="text-2xl font-bold text-brand-700 mb-6 pb-3 border-b border-gray-100">4. Marketing & Sales Strategy</h2>
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
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${ch.priority === 'High' ? 'bg-red-50 text-red-600' : ch.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-500'}`}>
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

        {/* Financial Projections */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm print:shadow-none print:border-0">
          <h2 className="text-2xl font-bold text-brand-700 mb-6 pb-3 border-b border-gray-100">5. Financial Projections</h2>
          <p className="text-gray-700 mb-6">{plan.financialProjections.revenueModel}</p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Metric</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Year 1</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Year 2</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Year 3</th>
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
        </section>

        {/* Operations Plan */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm print:shadow-none print:border-0">
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

        {/* Risk Analysis */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm print:shadow-none print:border-0">
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
        <div className="text-center py-8 text-sm text-gray-400">
          <p>Generated by BizPlan Genius — AI-powered business plans with real market research</p>
          <p className="mt-1">Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </main>
    </div>
  );
}
