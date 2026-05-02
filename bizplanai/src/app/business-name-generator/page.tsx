'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'Technology / SaaS', 'E-commerce / Retail', 'Food & Beverage', 'Health & Wellness',
  'Education / EdTech', 'Finance / FinTech', 'Real Estate', 'Marketing / Agency',
  'Manufacturing', 'Consulting / Services', 'Travel / Hospitality', 'Entertainment / Media',
  'Construction', 'Transportation / Logistics', 'Agriculture', 'Other',
];

const STYLES = [
  { key: 'professional', label: 'Professional', desc: 'Corporate, trustworthy' },
  { key: 'creative', label: 'Creative', desc: 'Unique, memorable' },
  { key: 'modern', label: 'Modern', desc: 'Tech-forward, sleek' },
  { key: 'classic', label: 'Classic', desc: 'Timeless, elegant' },
];

interface NameIdea {
  name: string;
  tagline: string;
  reasoning: string;
  domainSuggestion: string;
  style: string;
}

export default function BusinessNameGenerator() {
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [style, setStyle] = useState('professional');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<NameIdea[] | null>(null);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNames(null);

    try {
      const res = await fetch('/api/business-name-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, industry, style, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNames(data.names);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (name: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500">Business Name Generator</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {!names ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">AI Business Name Generator</h1>
              <p className="text-gray-600 text-lg">Describe your business idea and get 10 unique name suggestions with taglines and domain ideas.</p>
              <p className="text-brand-600 font-semibold mt-2">100% free. Results in seconds.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Describe Your Business Idea *</label>
                <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="e.g., A subscription box for eco-friendly home products delivered monthly..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry *</label>
                <select required value={industry} onChange={e => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white">
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STYLES.map(s => (
                    <button key={s.key} type="button" onClick={() => setStyle(s.key)}
                      className={`p-3 rounded-xl border-2 text-center transition ${style === s.key ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <p className="text-sm font-bold text-gray-900">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
                <p className="text-xs text-gray-400 mt-1">We'll send a copy to your email. No spam.</p>
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
                    Generating names...
                  </span>
                ) : 'Generate 10 Business Names - Free'}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Your Business Name Ideas</h1>
              <p className="text-gray-500">Click the heart to save your favorites</p>
            </div>

            <div className="space-y-3">
              {names.map((n, i) => (
                <div key={i} className={`bg-white rounded-xl border shadow-sm p-5 transition ${favorites.has(n.name) ? 'border-brand-300 ring-1 ring-brand-200' : 'border-gray-100'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{n.name}</h3>
                      <p className="text-sm text-brand-600 italic">"{n.tagline}"</p>
                    </div>
                    <button onClick={() => toggleFavorite(n.name)} className="text-2xl transition hover:scale-110 flex-shrink-0 ml-3">
                      {favorites.has(n.name) ? (
                        <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      ) : (
                        <svg className="w-7 h-7 text-gray-300 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{n.reasoning}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">{n.domainSuggestion}</span>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded capitalize">{n.style}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Upsell */}
            <div className="bg-white rounded-2xl border-2 border-brand-200 p-8 text-center">
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-2">Found a name you love?</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Now build the business around it</h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Get a full business plan, competitor analysis, website, pitch deck, and brand kit - all powered by AI.
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
                <a href="/brand-kit" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Brand Kit</p>
                  <p className="text-xs text-orange-600 font-bold">$29</p>
                </a>
                <a href="/build-website" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Website</p>
                  <p className="text-xs text-accent-600 font-bold">$99</p>
                </a>
                <a href="/social-pack" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Social Pack</p>
                  <p className="text-xs text-pink-600 font-bold">$29</p>
                </a>
                <a href="/pitch-deck" className="p-3 rounded-lg hover:bg-gray-50 transition text-center">
                  <p className="font-bold text-gray-900 text-sm">Pitch Deck</p>
                  <p className="text-xs text-purple-600 font-bold">$39</p>
                </a>
              </div>
            </div>

            {/* Other free tools */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>More free tools:</span>
              <a href="/free-competitor-check" className="text-brand-600 underline">Competitor Check</a>
              <a href="/startup-cost-calculator" className="text-brand-600 underline">Cost Calculator</a>
            </div>

            <div className="text-center">
              <button onClick={() => { setNames(null); setDescription(''); setIndustry(''); }}
                className="text-sm text-gray-500 hover:text-gray-700 underline">Generate new names</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
