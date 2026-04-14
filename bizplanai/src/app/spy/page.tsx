'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'Technology / SaaS', 'E-commerce / Retail', 'Food & Beverage', 'Health & Wellness',
  'Education / EdTech', 'Finance / FinTech', 'Real Estate', 'Marketing / Agency',
  'Manufacturing', 'Consulting / Services', 'Travel / Hospitality', 'Entertainment / Media',
  'Construction', 'Transportation / Logistics', 'Agriculture', 'Fitness / Sports',
  'Beauty / Cosmetics', 'Automotive', 'Pet Industry', 'Other',
];

const REPORT_SECTIONS = [
  { icon: '📋', title: 'Executive Summary', desc: 'One-page snapshot of your competitive landscape, key threats, and top opportunities' },
  { icon: '🎯', title: 'Competitor Profiles', desc: '5-15 real competitors with pricing, positioning, strengths, weaknesses, and customer reviews' },
  { icon: '💰', title: 'Pricing Comparison', desc: 'Side-by-side pricing matrix so you know exactly where you stand vs every competitor' },
  { icon: '📊', title: 'Market Positioning Map', desc: 'Visual breakdown of where each competitor sits and where the gaps are' },
  { icon: '🔍', title: 'SWOT Analysis', desc: 'Strengths, weaknesses, opportunities, and threats across the competitive set' },
  { icon: '🛡️', title: 'Vulnerability Audit', desc: 'Deep-dive into each competitor\'s biggest weaknesses, feature gaps, and customer friction points' },
  { icon: '💡', title: 'Opportunity Engineering', desc: 'Untapped market gaps with impact scores, exploitation plans, and risk assessments' },
  { icon: '🗺️', title: '90-Day Tactical Roadmap', desc: 'Week-by-week action plan: what to build first, quick wins, and strategic plays' },
  { icon: '🧠', title: 'Strategic Recommendations', desc: 'Positioning, pricing strategy, go-to-market plan, and top differentiation moves with ROI estimates' },
  { icon: '📈', title: 'Market Overview', desc: 'Industry size, growth trends, and key forces shaping your competitive landscape' },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-sm text-gray-600 hover:text-brand-600 transition">Business Plans</a>
          <a href="/spy" className="text-sm text-brand-600 font-semibold">Competitor Spy</a>
          <a href="/blog" className="text-sm text-gray-600 hover:text-brand-600 transition">Blog</a>
          <a href="/methodology" className="text-sm text-gray-600 hover:text-brand-600 transition">Methodology</a>
          <a href="#how-it-works" className="text-sm text-gray-600 hover:text-brand-600 transition">How It Works</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-brand-600 transition">Pricing</a>
          <a href="#get-started" className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition shadow-md shadow-brand-600/20">
            Spy on Competitors
          </a>
        </nav>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
          <a href="/" className="block text-gray-600 hover:text-brand-600 py-2">Business Plans</a>
          <a href="/spy" className="block text-brand-600 font-semibold py-2">Competitor Spy</a>
          <a href="/blog" className="block text-gray-600 hover:text-brand-600 py-2">Blog</a>
          <a href="/methodology" className="block text-gray-600 hover:text-brand-600 py-2">Methodology</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2">How It Works</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2">Pricing</a>
          <a href="#get-started" className="block w-full text-center px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-lg">
            Spy on Competitors
          </a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-28 pb-20 px-4 bg-hero-pattern">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full mb-6 border border-green-100">
          100% Money-Back Guarantee
        </div>
        <div className="flex justify-center mb-6">
          <a
            href="https://www.producthunt.com/products/competitor-spy?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-competitor-spy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="Competitor Spy - Know exactly how to beat your competitors for $19 | Product Hunt"
              width={250}
              height={54}
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1122669&theme=dark&t=1776151861733"
            />
          </a>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Real competitor intelligence for{' '}
          <span className="text-gradient">$19 once.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
          The cheapest enterprise alternative is $1,000+ per month. We deliver the same depth as a one-time PDF,
          powered by Google Gemini 2.5 with live web search.
        </p>
        <p className="text-base text-gray-500 max-w-2xl mx-auto mb-10">
          Enter a company name or describe your industry. Get 10 to 15 real competitors, pricing, SWOT, vulnerabilities,
          and a 90-day attack plan in under 3 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#get-started" className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg">
            Get Your Competitor Report - $19
          </a>
          <a href="#sample-report" className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-brand-300 hover:text-brand-600 transition text-lg">
            See a Sample Report
          </a>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            One-time payment
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Real data, not generic AI filler
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            PDF delivered in under 3 minutes
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Money-back guarantee
          </span>
        </div>
      </div>
    </section>
  );
}

function ComparisonBanner() {
  const rows = [
    { name: 'Crayon', price: '$1,000+/mo', model: 'Annual subscription', built: 'Enterprise CI teams' },
    { name: 'Klue', price: '$1,200+/mo', model: 'Annual subscription', built: 'Sales enablement teams' },
    { name: 'Kompyte', price: 'Custom (4-figure/mo)', model: 'Annual subscription', built: 'Mid-market and enterprise' },
    { name: 'Hiring a consultant', price: '$500-2,000', model: 'One-time, 1-2 weeks', built: 'Single project' },
    { name: 'Competitor Spy', price: '$19', model: 'One-time, under 3 min', built: 'Founders, solopreneurs, agencies', highlight: true },
  ];
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Stop paying $1,000+ a month for data you only need once.</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Enterprise competitive intelligence platforms charge yearly contracts for ongoing monitoring. Most founders just
          need one solid report. Here is what the market actually charges.
        </p>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tool</th>
                  <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Built for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r, i) => (
                  <tr key={i} className={r.highlight ? 'bg-brand-50' : ''}>
                    <td className={`px-4 sm:px-6 py-4 font-semibold ${r.highlight ? 'text-brand-700' : 'text-gray-800'}`}>
                      {r.name}
                      {r.highlight && <span className="ml-2 inline-block px-2 py-0.5 bg-brand-600 text-white text-xs font-bold rounded-full align-middle">YOU</span>}
                    </td>
                    <td className={`px-4 sm:px-6 py-4 font-bold ${r.highlight ? 'text-brand-700' : 'text-gray-800'}`}>{r.price}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{r.model}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{r.built}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Competitor pricing accurate as of public listings on each company website. We are not affiliated with any of these tools.
        </p>
      </div>
    </section>
  );
}

function WhatYouGet() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What's In Your Report</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every report is custom-researched using AI with real web data. No templates, no generic filler.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORT_SECTIONS.map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-300 hover:shadow-md transition">
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: '1', title: 'Enter Your Target', desc: 'Type a company name, website URL, or describe your industry.' },
    { num: '2', title: 'Pay $19', desc: 'One-time payment via Stripe. No subscription, no hidden fees.' },
    { num: '3', title: 'Get Your Report', desc: 'AI researches real competitors and delivers your PDF in under 3 minutes.' },
  ];
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 bg-brand-600 text-white text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                {s.num}
              </div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpyForm() {
  const [mode, setMode] = useState<'company' | 'industry'>('company');
  const [form, setForm] = useState({
    companyName: '',
    companyUrl: '',
    industryDescription: '',
    industry: '',
    city: '',
    country: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/spy-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mode }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="get-started" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 id="pricing" className="text-3xl sm:text-4xl font-bold mb-4">Get Your Competitor Report</h2>
          <p className="text-lg text-gray-600">
            Already have a business? Enter it below. Still exploring? Describe your market instead.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sm:p-8 space-y-6">
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode('company')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition ${mode === 'company' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              I Have a Business
            </button>
            <button
              type="button"
              onClick={() => setMode('industry')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition ${mode === 'industry' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              I Have an Idea
            </button>
          </div>

          {mode === 'company' ? (
            <>
              <p className="text-sm text-gray-500 bg-brand-50 border border-brand-100 rounded-lg px-4 py-2.5">
                Enter your company name and website. We'll find 10-15 competitors in your space, analyze how you stack up, and give you a strategy to outperform them.
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Company or Brand Name *</label>
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={e => update('companyName', e.target.value)}
                  placeholder="e.g., My Coffee Co, FreshBrew, your brand name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Website <span className="text-gray-400 font-normal">(recommended for best results)</span>
                </label>
                <input
                  type="text"
                  value={form.companyUrl}
                  onChange={e => update('companyUrl', e.target.value)}
                  placeholder="e.g., mycoffeeco.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 bg-brand-50 border border-brand-100 rounded-lg px-4 py-2.5">
                Exploring a new market? Describe your niche and we'll map out 10-15 competitors, compare their pricing, and give you a 90-day plan to enter and win.
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Describe Your Industry or Niche *</label>
                <textarea
                  required
                  rows={3}
                  value={form.industryDescription}
                  onChange={e => update('industryDescription', e.target.value)}
                  placeholder="e.g., Direct-to-consumer artisan coffee subscription service in the US, targeting millennials who want ethically sourced single-origin beans"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry Category *</label>
                <select
                  required
                  value={form.industry}
                  onChange={e => update('industry', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white"
                >
                  <option value="">Select category</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
            </>
          )}

          {/* Location - City & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                City <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={e => update('city', e.target.value)}
                placeholder="e.g., Austin, London, Toronto"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Country <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.country}
                onChange={e => update('country', e.target.value)}
                placeholder="e.g., United States, UK, Canada"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 -mt-4">Adding location helps find local and regional competitors relevant to your market.</p>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          {/* Submit */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Get My Competitor Report - $19'}
            </button>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure Payment
              </span>
              <span>|</span>
              <span>Powered by Stripe</span>
              <span>|</span>
              <span>PDF in under 3 min</span>
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-sm text-green-800 font-medium">
                100% Money-Back Guarantee. If your report doesn't contain real competitor data, we'll refund you. No questions asked.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function SampleSpyReport() {
  return (
    <section id="sample-report" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">See a Real Competitor Report</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This is an actual report generated by Competitor Spy for the artisan coffee subscription market.
            Every data point comes from real web research.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Artisan Coffee Subscription Market</p>
                <p className="text-sm text-gray-500">38-page report with 15 competitors analyzed</p>
              </div>
            </div>
            <a
              href="/sample-spy-report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition shadow-md shadow-brand-600/20"
            >
              View Sample Report (PDF)
            </a>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4">What's inside this report:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Executive Summary with market size and key opportunities',
                '15 real competitors: Trade Coffee, Blue Bottle, Cometeer, and more',
                'Detailed competitor profiles with pricing tables and strengths/weaknesses',
                'Side-by-side pricing comparison across all competitors',
                'Market positioning map showing where each player sits',
                'Full SWOT analysis of the competitive landscape',
                'Vulnerability audit for all 15 competitors with exploitation angles',
                '6 opportunity strategies with detailed action plans',
                '90-day tactical roadmap split into 4 phases with expected outcomes',
                'Go-to-market strategy, differentiation plays, and what to build first',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-brand-50 rounded-xl border border-brand-100">
              <p className="text-sm text-brand-800">
                <span className="font-semibold">This is not a template.</span> Every report is uniquely researched using AI with live web data.
                Real competitor names, real pricing, real customer sentiment.
                A consultant would charge $500+ for this analysis.
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <a href="#get-started" className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg inline-block">
            Get Your Own Report - $19
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: 'What kind of data does the report include?',
      a: 'Real competitor names, actual pricing pulled from their websites, market positioning analysis, strengths and weaknesses based on customer reviews and public data, and strategic recommendations tailored to your situation.',
    },
    {
      q: 'How is this different from just asking ChatGPT?',
      a: 'ChatGPT makes up data. Our AI uses real-time web research to find actual competitors, real pricing, and real market data. Every data point in your report is grounded in current information, not hallucinated.',
    },
    {
      q: 'How long does it take to get my report?',
      a: 'Under 3 minutes. After payment, our AI immediately begins researching your market and generates a professional PDF report. You can download it instantly from the results page.',
    },
    {
      q: 'Can I use this for investor pitches?',
      a: 'Absolutely. The competitive analysis section is exactly what investors want to see. Pair it with a BizPlan Genius business plan for the complete package.',
    },
    {
      q: 'What if the report is missing a competitor I know about?',
      a: 'Our AI typically finds 10-15+ of the most relevant competitors based on real market data. If you know of specific competitors, mention them in the industry description and we will include them in the analysis.',
    },
    {
      q: 'Is this a subscription?',
      a: 'No. One payment of $19, one report. No recurring charges, no hidden fees. If you need another report for a different market, just purchase again.',
    },
    {
      q: 'What if I\'m not happy with the report?',
      a: 'We offer a 100% money-back guarantee. If your report doesn\'t contain real competitor data, just email us and we\'ll refund you. No questions asked.',
    },
  ];

  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
              >
                <span className="font-semibold text-gray-800">{faq.q}</span>
                <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-white font-bold text-lg">BizPlan Genius</span>
          <p className="text-sm mt-1">AI-powered business intelligence tools</p>
        </div>
        <a
          href="https://www.producthunt.com/products/competitor-spy?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-competitor-spy"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Competitor Spy - Know exactly how to beat your competitors for $19 | Product Hunt"
            width={200}
            height={43}
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1122669&theme=dark&t=1776151861733"
          />
        </a>
        <div className="flex gap-6 text-sm">
          <a href="/" className="hover:text-white transition">Business Plans</a>
          <a href="/spy" className="hover:text-white transition">Competitor Spy</a>
          <a href="/blog" className="hover:text-white transition">Blog</a>
          <a href="/methodology" className="hover:text-white transition">Methodology</a>
          <a href="/privacy" className="hover:text-white transition">Privacy</a>
          <a href="/terms" className="hover:text-white transition">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default function SpyPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ComparisonBanner />
        <SampleSpyReport />
        <WhatYouGet />
        <HowItWorks />
        <SpyForm />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
