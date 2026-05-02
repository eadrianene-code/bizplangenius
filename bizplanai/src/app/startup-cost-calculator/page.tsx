'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'Technology / SaaS', 'E-commerce / Retail', 'Food & Beverage', 'Health & Wellness',
  'Education / EdTech', 'Finance / FinTech', 'Real Estate', 'Marketing / Agency',
  'Manufacturing', 'Consulting / Services', 'Travel / Hospitality', 'Entertainment / Media',
  'Construction', 'Transportation / Logistics', 'Agriculture', 'Other',
];

interface CostItem { name: string; low: number; high: number; note?: string; }
interface Category { name: string; lowEstimate: number; highEstimate: number; items: CostItem[]; }
interface Result {
  businessType: string;
  totalLow: number;
  totalHigh: number;
  categories: Category[];
  monthlyOperating: { low: number; high: number; items: CostItem[]; };
  breakEvenMonths: { optimistic: number; realistic: number; conservative: number; };
  tip: string;
}

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function StartupCostCalculator() {
  const [businessType, setBusinessType] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [expandedCat, setExpandedCat] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/startup-cost-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType, industry, location, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500">Startup Cost Calculator</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {!result ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Startup Cost Calculator</h1>
              <p className="text-gray-600 text-lg">Find out how much it costs to start your business. Real estimates based on your industry and location.</p>
              <p className="text-brand-600 font-semibold mt-2">100% free. Real market data.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">What business are you starting? *</label>
                <input type="text" required value={businessType} onChange={e => setBusinessType(e.target.value)}
                  placeholder="e.g., Coffee shop, SaaS app, Food truck, Cleaning service..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry *</label>
                <select required value={industry} onChange={e => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition bg-white">
                  <option value="">Select</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="e.g., New York, USA (optional, improves accuracy)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition" />
                <p className="text-xs text-gray-400 mt-1">We'll send a copy of your estimate. No spam.</p>
              </div>
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60">
                {loading ? 'Calculating...' : 'Calculate My Startup Costs - Free'}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            {/* Total */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <h1 className="text-xl font-bold text-gray-900 mb-1">Estimated Startup Cost</h1>
              <p className="text-sm text-gray-500 mb-4">{result.businessType}</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-600">{formatMoney(result.totalLow)}</span>
                <span className="text-xl text-gray-400">-</span>
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-600">{formatMoney(result.totalHigh)}</span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Cost Breakdown</h2>
              {result.categories.map((cat, ci) => (
                <div key={ci} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <button onClick={() => setExpandedCat(expandedCat === ci ? null : ci)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition">
                    <span className="font-semibold text-gray-900 text-sm">{cat.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-700">{formatMoney(cat.lowEstimate)} - {formatMoney(cat.highEstimate)}</span>
                      <svg className={`w-4 h-4 text-gray-400 transition ${expandedCat === ci ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {expandedCat === ci && (
                    <div className="px-5 pb-4 border-t border-gray-100">
                      {cat.items.map((item, ii) => (
                        <div key={ii} className="flex items-center justify-between py-2 text-sm">
                          <div>
                            <span className="text-gray-700">{item.name}</span>
                            {item.note && <p className="text-xs text-gray-400">{item.note}</p>}
                          </div>
                          <span className="text-gray-500 font-mono text-xs">{formatMoney(item.low)} - {formatMoney(item.high)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Monthly Operating */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Monthly Operating Costs</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-sm">Estimated monthly</span>
                <span className="font-bold text-gray-900">{formatMoney(result.monthlyOperating.low)} - {formatMoney(result.monthlyOperating.high)}</span>
              </div>
              {result.monthlyOperating.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="text-gray-500 font-mono text-xs">{formatMoney(item.low)} - {formatMoney(item.high)}</span>
                </div>
              ))}
            </div>

            {/* Break Even */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Estimated Break-Even Timeline</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-extrabold text-green-600">{result.breakEvenMonths.optimistic} mo</p>
                  <p className="text-xs text-gray-500">Optimistic</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-brand-600">{result.breakEvenMonths.realistic} mo</p>
                  <p className="text-xs text-gray-500">Realistic</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-amber-600">{result.breakEvenMonths.conservative} mo</p>
                  <p className="text-xs text-gray-500">Conservative</p>
                </div>
              </div>
            </div>

            {/* Tip */}
            {result.tip && (
              <div className="bg-accent-50 rounded-xl p-4 border border-accent-100">
                <p className="text-xs font-bold text-accent-700 uppercase mb-1">Money-Saving Tip</p>
                <p className="text-sm text-accent-800">{result.tip}</p>
              </div>
            )}

            {/* Upsell */}
            <div className="bg-white rounded-2xl border-2 border-brand-200 p-8 text-center">
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-2">Ready to plan your launch?</p>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get a full business plan with detailed financial projections</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <a href="/free-competitor-check" className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">Free Competitor Check</a>
                <a href="/generate" className="px-6 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition">Business Plan - $97</a>
                <a href="/bundles" className="px-6 py-3 border-2 border-accent-300 text-accent-700 font-semibold rounded-lg hover:bg-accent-50 transition">Bundle & Save</a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 border-t border-gray-100">
                <a href="/investor-emails" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Investor Emails</p>
                  <p className="text-xs text-indigo-600 font-bold">$19</p>
                </a>
                <a href="/pitch-deck" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Pitch Deck</p>
                  <p className="text-xs text-purple-600 font-bold">$39</p>
                </a>
                <a href="/build-website" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Website</p>
                  <p className="text-xs text-accent-600 font-bold">$99</p>
                </a>
                <a href="/brand-kit" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Brand Kit</p>
                  <p className="text-xs text-orange-600 font-bold">$29</p>
                </a>
              </div>
            </div>

            {/* Other free tools */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>More free tools:</span>
              <a href="/free-competitor-check" className="text-brand-600 underline">Competitor Check</a>
              <a href="/business-name-generator" className="text-brand-600 underline">Name Generator</a>
            </div>

            <div className="text-center">
              <button onClick={() => { setResult(null); setBusinessType(''); setIndustry(''); }}
                className="text-sm text-gray-500 hover:text-gray-700 underline">Calculate for a different business</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
