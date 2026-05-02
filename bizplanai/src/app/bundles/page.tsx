'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'Technology / SaaS', 'E-commerce / Retail', 'Food & Beverage', 'Health & Wellness',
  'Education / EdTech', 'Finance / FinTech', 'Real Estate', 'Marketing / Agency',
  'Manufacturing', 'Consulting / Services', 'Travel / Hospitality', 'Entertainment / Media',
  'Construction', 'Transportation / Logistics', 'Agriculture', 'Other',
];

const BUNDLES = [
  {
    key: 'starter',
    name: 'Starter Bundle',
    price: 59,
    originalPrice: 68,
    savings: 9,
    tagline: 'Research + Plan',
    products: [
      { name: 'Competitor Spy Report', desc: '10-15 real competitors with SWOT, pricing comparison, vulnerability audit, and 90-day tactical roadmap', solo: '$97' },
      { name: 'Pro Business Plan', desc: '9-section investor-ready PDF: executive summary, competitor analysis, market sizing, financials, operations, risk analysis', solo: '$147' },
    ],
    color: 'border-brand-300 bg-brand-50',
    buttonColor: 'bg-brand-600 hover:bg-brand-700',
  },
  {
    key: 'launch',
    name: 'Launch Pack',
    price: 199,
    originalPrice: 206,
    savings: 68,
    tagline: 'Research + Plan + Website + Pitch',
    popular: true,
    products: [
      { name: 'Competitor Spy Report', desc: '10-15 competitors analyzed with real data from the web', solo: '$97' },
      { name: 'Pro Business Plan', desc: '9-section plan with 3-year financial projections and money-back guarantee', solo: '$147' },
      { name: 'Website (Landing Page)', desc: 'Multi-page, responsive, editable website with full source code download', solo: '$99' },
      { name: 'Investor Pitch Deck', desc: '12 slides with speaker notes: problem, solution, market, financials, the ask', solo: '$39' },
    ],
    color: 'border-accent-300 bg-accent-50',
    buttonColor: 'bg-accent-600 hover:bg-accent-700',
  },
  {
    key: 'full',
    name: 'Full Business Kit',
    price: 349,
    originalPrice: 374,
    savings: 25,
    tagline: 'Everything you need to launch',
    products: [
      { name: 'Competitor Spy Report', desc: '10-15 competitors, SWOT, pricing, vulnerability audit, 90-day roadmap', solo: '$97' },
      { name: 'Pro Business Plan', desc: '9-section investor-ready PDF with operations and risk analysis', solo: '$147' },
      { name: 'Website', desc: '6 types available (e-commerce, restaurant, SaaS, etc.), multi-page, editable', solo: '$99' },
      { name: 'Investor Pitch Deck', desc: '12 slides with speaker notes for investor meetings', solo: '$39' },
      { name: 'Social Media Pack', desc: '30 days of posts for Twitter, LinkedIn, Instagram, Facebook with hashtags', solo: '$29' },
      { name: 'Logo & Brand Kit', desc: '3 logo concepts, 5-color palette, typography, brand voice, social bio', solo: '$29' },
    ],
    color: 'border-purple-300 bg-purple-50',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
  },
];

export default function BundlesPage() {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [form, setForm] = useState({
    businessName: '', industry: '', description: '', targetMarket: '',
    revenueModel: '', location: '', investment: '', competitors: '', email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBundle || !form.email) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/bundle-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bundle: selectedBundle, ...form }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error('Checkout failed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bundle = BUNDLES.find(b => b.key === selectedBundle);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <a href="/#pricing" className="text-sm text-gray-500 hover:text-gray-700">Or buy individually</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Save More With Bundles</h1>
          <p className="text-gray-600 text-lg">Get everything you need to launch your business at a discount.</p>
        </div>

        {/* Bundle Cards */}
        {!selectedBundle && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {BUNDLES.map(b => (
              <div key={b.key} className={`rounded-2xl border-2 ${b.color} p-6 relative ${b.popular ? 'ring-2 ring-accent-500' : ''}`}>
                {b.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-600 text-white text-xs font-bold rounded-full uppercase">Most Popular</div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{b.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{b.tagline}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-extrabold text-gray-900">${b.price}</span>
                  <span className="text-lg text-gray-400 line-through">${b.originalPrice}</span>
                  <span className="text-sm font-bold text-green-600">Save ${b.savings}</span>
                </div>
                <div className="space-y-3 mb-6">
                  {b.products.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                          <span className="text-xs text-gray-400 line-through">{p.solo}</span>
                        </div>
                        <p className="text-xs text-gray-500">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedBundle(b.key)}
                  className={`w-full px-6 py-3 text-white font-bold rounded-xl transition shadow-lg ${b.buttonColor}`}
                >
                  Choose {b.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Business form (after selecting bundle) */}
        {selectedBundle && bundle && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{bundle.name}: ${bundle.price}</h2>
                <p className="text-sm text-gray-500">{bundle.products.length} products included</p>
              </div>
              <button onClick={() => setSelectedBundle(null)} className="text-sm text-gray-500 underline hover:text-gray-700">
                Change bundle
              </button>
            </div>

            <form onSubmit={handleCheckout} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">Tell us about your business (we'll generate all products from this):</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name *</label>
                  <input type="text" required value={form.businessName} onChange={e => update('businessName', e.target.value)}
                    placeholder="e.g., FreshBite Meal Delivery" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Industry *</label>
                  <select required value={form.industry} onChange={e => update('industry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition bg-white">
                    <option value="">Select</option>
                    {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Describe Your Business *</label>
                <textarea required rows={3} value={form.description} onChange={e => update('description', e.target.value)}
                  placeholder="What does your business do? What problem does it solve?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Target Market *</label>
                <input type="text" required value={form.targetMarket} onChange={e => update('targetMarket', e.target.value)}
                  placeholder="Who are your ideal customers?" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Revenue Model *</label>
                  <input type="text" required value={form.revenueModel} onChange={e => update('revenueModel', e.target.value)}
                    placeholder="e.g., Monthly subscription" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <input type="text" value={form.location} onChange={e => update('location', e.target.value)}
                    placeholder="e.g., Online / USA" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition" />
              </div>

              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

              <button type="submit" disabled={loading}
                className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60">
                {loading ? 'Processing...' : `Get ${bundle.name}: $${bundle.price}`}
              </button>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>One-time payment</span><span>|</span><span>All {bundle.products.length} products generated</span><span>|</span><span>Secure checkout</span>
              </div>
            </form>
          </div>
        )}

        {/* Compare */}
        {!selectedBundle && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Not sure? <a href="/free-competitor-check" className="text-brand-600 underline">Try our free competitor check first</a>
              {' '}or <a href="/#pricing" className="text-brand-600 underline">buy products individually</a>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
