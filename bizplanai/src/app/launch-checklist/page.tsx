'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'Technology / SaaS', 'E-commerce / Retail', 'Food & Beverage', 'Health & Wellness',
  'Education / EdTech', 'Finance / FinTech', 'Real Estate', 'Marketing / Agency',
  'Manufacturing', 'Consulting / Services', 'Travel / Hospitality', 'Entertainment / Media',
  'Construction', 'Transportation / Logistics', 'Agriculture', 'Other',
];

interface Step { title: string; description: string; estimatedCost: string; timeNeeded: string; resources: string[]; priority: string; }
interface Phase { name: string; timeline: string; steps: Step[]; }
interface ChecklistData { businessType: string; location: string; totalSteps: number; estimatedTimeline: string; estimatedCost: string; phases: Phase[]; }

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  important: 'bg-amber-100 text-amber-700',
  optional: 'bg-gray-100 text-gray-600',
};

export default function LaunchChecklistPage() {
  const [businessType, setBusinessType] = useState('');
  const [industry, setIndustry] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('United States');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChecklistData | null>(null);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/launch-checklist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType, industry, state, country, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      if (typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track', 'Lead', { content_name: 'launch_checklist' });
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const toggleCheck = (id: string) => {
    setChecked(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const totalSteps = result ? result.phases.reduce((sum, p) => sum + p.steps.length, 0) : 0;
  const completedSteps = checked.size;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500">Launch Checklist</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {!result ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Business Launch Checklist</h1>
              <p className="text-gray-600 text-lg">Get a personalized, step-by-step checklist to legally start your business. Specific to your state, industry, and business type.</p>
              <p className="text-brand-600 font-semibold mt-2">100% free. Real legal requirements. Takes 30 seconds.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">What business are you starting? *</label>
                <input type="text" required value={businessType} onChange={e => setBusinessType(e.target.value)}
                  placeholder="e.g., Coffee shop, SaaS app, Cleaning service, Food truck..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry</label>
                <select value={industry} onChange={e => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none transition bg-white">
                  <option value="">Select (optional)</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">State / Province</label>
                  <input type="text" value={state} onChange={e => setState(e.target.value)}
                    placeholder="e.g., California, Texas, Ontario"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                  <input type="text" value={country} onChange={e => setCountry(e.target.value)}
                    placeholder="United States"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none transition" />
                <p className="text-xs text-gray-400 mt-1">We'll send a copy. No spam.</p>
              </div>
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Researching requirements...
                  </span>
                ) : 'Get My Launch Checklist - Free'}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Launch Checklist</h1>
              <p className="text-gray-500 text-sm">{result.businessType} in {result.location}</p>
            </div>

            {/* Progress + summary */}
            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-900">{completedSteps} of {totalSteps} steps completed</span>
                <span className="text-sm font-bold text-brand-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div className="h-3 rounded-full bg-brand-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div><p className="font-bold text-gray-900">{result.estimatedTimeline}</p><p className="text-xs text-gray-500">Timeline</p></div>
                <div><p className="font-bold text-gray-900">{result.estimatedCost}</p><p className="text-xs text-gray-500">Estimated cost</p></div>
                <div><p className="font-bold text-gray-900">{totalSteps} steps</p><p className="text-xs text-gray-500">Total tasks</p></div>
              </div>
            </div>

            {/* Phases */}
            {(result.phases || []).map((phase, pi) => (
              <div key={pi} className="bg-white rounded-2xl border overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900">{phase.name}</h2>
                    <p className="text-xs text-gray-500">{phase.timeline}</p>
                  </div>
                  <span className="text-xs text-gray-400">{phase.steps.filter(s => checked.has(`${pi}-${phase.steps.indexOf(s)}`)).length}/{phase.steps.length} done</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {phase.steps.map((step, si) => {
                    const id = `${pi}-${si}`;
                    const isChecked = checked.has(id);
                    return (
                      <div key={si} className={`px-5 py-4 transition ${isChecked ? 'bg-green-50/50' : ''}`}>
                        <div className="flex items-start gap-3">
                          <button onClick={() => toggleCheck(id)}
                            className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition ${
                              isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-brand-400'
                            }`}>
                            {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`font-semibold text-sm ${isChecked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{step.title}</p>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${PRIORITY_STYLES[step.priority] || PRIORITY_STYLES.optional}`}>{step.priority}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                            <div className="flex items-center gap-4 text-[10px] text-gray-400">
                              <span>Cost: {step.estimatedCost}</span>
                              <span>Time: {step.timeNeeded}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Upsell */}
            <div className="bg-white rounded-2xl border-2 border-brand-200 p-8 text-center">
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-2">Ready to launch faster?</p>
              <h3 className="text-xl font-bold text-gray-900 mb-3">We can do most of these steps for you</h3>
              <p className="text-gray-600 mb-6 text-sm max-w-lg mx-auto">Business plan, website, brand kit, legal pages, social media, ad copy, pitch deck -- all generated from one business description.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                <a href="/bundles" className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-600/25">Full Business Kit - $349</a>
                <a href="/generate" className="px-6 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition">Business Plan - $29</a>
                <a href="/free-competitor-check" className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">Free Competitor Check</a>
              </div>
            </div>

            {/* Other free tools */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 flex-wrap">
              <span>More free tools:</span>
              <a href="/free-competitor-check" className="text-brand-600 underline">Competitor Check</a>
              <a href="/business-name-generator" className="text-brand-600 underline">Name Generator</a>
              <a href="/startup-cost-calculator" className="text-brand-600 underline">Cost Calculator</a>
              <a href="/validate-idea" className="text-brand-600 underline">Idea Validator</a>
            </div>

            <div className="text-center">
              <button onClick={() => { setResult(null); setBusinessType(''); setState(''); }}
                className="text-sm text-gray-500 hover:text-gray-700 underline">Generate for a different business</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
