'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'Technology / SaaS', 'E-commerce / Retail', 'Food & Beverage', 'Health & Wellness',
  'Education / EdTech', 'Finance / FinTech', 'Real Estate', 'Marketing / Agency',
  'Manufacturing', 'Consulting / Services', 'Travel / Hospitality', 'Entertainment / Media',
  'Construction', 'Transportation / Logistics', 'Agriculture', 'Other',
];

interface Competitor {
  name: string;
  website: string;
  description: string;
  strength: string;
  weakness: string;
}

interface Result {
  competitors: Competitor[];
  marketInsight: string;
}

export default function FreeCompetitorCheck() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [industry, setIndustry] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/free-competitor-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessIdea, industry, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setResult(data);

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'free_competitor_check',
          content_category: industry,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500">Free Competitor Check</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {!result ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Find Your Top 3 Competitors
              </h1>
              <p className="text-gray-600 text-lg">
                Describe your business idea and our AI will instantly find your real competitors, their strengths, and their weaknesses.
              </p>
              <p className="text-brand-600 font-semibold mt-2">100% free. Takes 30 seconds.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Business Idea *</label>
                <textarea
                  required
                  rows={3}
                  value={businessIdea}
                  onChange={e => setBusinessIdea(e.target.value)}
                  placeholder="e.g., An online platform that connects freelance designers with small businesses..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry *</label>
                <select
                  required
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white"
                >
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">We'll send a copy to your email. No spam, ever.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing your market...
                  </span>
                ) : (
                  'Find My Competitors - Free'
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>No payment required</span>
                <span>|</span>
                <span>Results in 30 seconds</span>
                <span>|</span>
                <span>Real data, not AI guesses</span>
              </div>
            </form>
          </>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Your Competitor Analysis</h1>
              <p className="text-gray-500">Here are 3 real competitors in your space</p>
            </div>

            {/* Competitors */}
            <div className="space-y-4">
              {result.competitors.map((comp, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{comp.name}</h3>
                      <a href={comp.website} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 hover:underline">
                        {comp.website}
                      </a>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">#{i + 1}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{comp.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-green-700 uppercase mb-1">Their Strength</p>
                      <p className="text-sm text-green-800">{comp.strength}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-red-700 uppercase mb-1">Their Weakness</p>
                      <p className="text-sm text-red-800">{comp.weakness}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Insight */}
            <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100">
              <h3 className="font-bold text-brand-900 mb-2">Market Insight</h3>
              <p className="text-brand-800 text-sm leading-relaxed">{result.marketInsight}</p>
            </div>

            {/* Upsell */}
            <div className="bg-white rounded-2xl border-2 border-brand-200 p-8 text-center">
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-2">Want the full picture?</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Get 10-15 competitors analyzed in depth
              </h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                This was just a taste. Our full Competitor Spy report includes pricing analysis, SWOT breakdowns, vulnerability audits, and a 90-day tactical roadmap to beat them all.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/spy"
                  className="inline-block px-8 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-600/25"
                >
                  Full Competitor Spy Report - $19
                </a>
                <a
                  href="/generate"
                  className="inline-block px-8 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition"
                >
                  Full Business Plan - $29
                </a>
              </div>
            </div>

            {/* Try Again */}
            <div className="text-center">
              <button
                onClick={() => { setResult(null); setBusinessIdea(''); setIndustry(''); }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Analyze a different business idea
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
