'use client';

import { useState } from 'react';

interface Category {
  name: string;
  score: number;
  analysis: string;
  evidence: string;
}

interface Result {
  ideaSummary: string;
  overallScore: number;
  verdict: string;
  categories: Category[];
  strengths: string[];
  risks: string[];
  nextSteps: string[];
  similarSuccessStory: string;
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 7 ? 'bg-green-500' : score >= 5 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = score >= 7 ? 'text-green-700' : score >= 5 ? 'text-amber-700' : 'text-red-700';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{score}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color} transition-all duration-500`} style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  );
}

function OverallScore({ score, verdict }: { score: number; verdict: string }) {
  const color = score >= 7 ? 'text-green-600 border-green-200 bg-green-50' : score >= 5 ? 'text-amber-600 border-amber-200 bg-amber-50' : 'text-red-600 border-red-200 bg-red-50';
  return (
    <div className={`text-center p-6 rounded-2xl border-2 ${color}`}>
      <p className="text-6xl font-extrabold">{score}</p>
      <p className="text-sm font-bold mt-1">/10</p>
      <p className="text-lg font-bold mt-2">{verdict}</p>
    </div>
  );
}

export default function ValidateIdeaPage() {
  const [idea, setIdea] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
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
      const res = await fetch('/api/validate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, targetCustomer, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', { content_name: 'validate_idea' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to validate. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500">Idea Validator</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {!result ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Is Your Business Idea Worth Pursuing?</h1>
              <p className="text-gray-600 text-lg">
                Our AI analyzes real market data to score your idea across 5 categories. Get an honest assessment with evidence, not guesses.
              </p>
              <p className="text-brand-600 font-semibold mt-2">100% free. Real data. Takes 30 seconds.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Describe Your Business Idea *</label>
                <textarea
                  required rows={4} value={idea} onChange={e => setIdea(e.target.value)}
                  placeholder="e.g., A mobile app that connects local dog owners for group walks and playdates. Monthly subscription of $9.99 with premium features like vet consultations..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">The more detail, the better the analysis</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Who is your target customer?</label>
                <input
                  type="text" value={targetCustomer} onChange={e => setTargetCustomer(e.target.value)}
                  placeholder="e.g., Dog owners aged 25-45 in urban areas (optional but improves accuracy)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">We'll send a copy. No spam.</p>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

              <button type="submit" disabled={loading}
                className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Researching your market...
                  </span>
                ) : 'Validate My Idea - Free'}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>No payment required</span>
                <span>|</span>
                <span>Real market data</span>
                <span>|</span>
                <span>Honest assessment</span>
              </div>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Idea Validation Report</h1>
              <p className="text-gray-500 text-sm">{result.ideaSummary}</p>
            </div>

            {/* Overall Score */}
            <OverallScore score={result.overallScore} verdict={result.verdict} />

            {/* Category Scores */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-gray-900">Detailed Scores</h2>
              {(result.categories || []).map((cat, i) => (
                <div key={i}>
                  <ScoreBar score={cat.score} label={cat.name} />
                  <p className="text-sm text-gray-600 mt-1">{cat.analysis}</p>
                  <p className="text-xs text-gray-400 mt-0.5 italic">Evidence: {cat.evidence}</p>
                </div>
              ))}
            </div>

            {/* Strengths & Risks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl border border-green-100 p-5">
                <h3 className="font-bold text-green-900 mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {(result.strengths || []).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl border border-red-100 p-5">
                <h3 className="font-bold text-red-900 mb-3">Risks</h3>
                <ul className="space-y-2">
                  {(result.risks || []).map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-brand-50 rounded-xl border border-brand-100 p-5">
              <h3 className="font-bold text-brand-900 mb-3">Recommended Next Steps</h3>
              <ol className="space-y-2">
                {(result.nextSteps || []).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-brand-800">
                    <span className="w-5 h-5 bg-brand-200 rounded-full flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            {/* Success Story */}
            {result.similarSuccessStory && (
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
                <h3 className="font-bold text-amber-900 mb-1">Similar Success Story</h3>
                <p className="text-sm text-amber-800">{result.similarSuccessStory}</p>
              </div>
            )}

            {/* Upsell */}
            <div className="bg-white rounded-2xl border-2 border-brand-200 p-8 text-center">
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-2">
                {result.overallScore >= 6 ? 'Your idea has potential!' : 'Want to refine this idea?'}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {result.overallScore >= 6 ? 'Turn it into a real business plan' : 'Get a deeper analysis with real competitor data'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Our AI will research 5-15 real competitors, create financial projections, and build you an investor-ready business plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <a href="/free-competitor-check" className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-600/25">
                  Free Competitor Check
                </a>
                <a href="/generate" className="px-6 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition">
                  Business Plan - $97
                </a>
                <a href="/bundles" className="px-6 py-3 border-2 border-accent-300 text-accent-700 font-semibold rounded-lg hover:bg-accent-50 transition">
                  Bundle & Save
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 border-t border-gray-100">
                <a href="/spy" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Spy Report</p>
                  <p className="text-xs text-brand-600 font-bold">$97</p>
                </a>
                <a href="/build-website" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Website</p>
                  <p className="text-xs text-accent-600 font-bold">$99</p>
                </a>
                <a href="/pitch-deck" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Pitch Deck</p>
                  <p className="text-xs text-purple-600 font-bold">$39</p>
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
              <a href="/startup-cost-calculator" className="text-brand-600 underline">Cost Calculator</a>
            </div>

            <div className="text-center">
              <button onClick={() => { setResult(null); setIdea(''); setTargetCustomer(''); }}
                className="text-sm text-gray-500 hover:text-gray-700 underline">Validate a different idea</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
