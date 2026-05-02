'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface FormData {
  businessName: string;
  industry: string;
  description: string;
  targetMarket: string;
  revenueModel: string;
  location: string;
  investment: string;
  competitors: string;
  email: string;
}

const INDUSTRIES = [
  'Technology / SaaS', 'E-commerce / Retail', 'Food & Beverage', 'Health & Wellness',
  'Education / EdTech', 'Finance / FinTech', 'Real Estate', 'Marketing / Agency',
  'Manufacturing', 'Consulting / Services', 'Travel / Hospitality', 'Entertainment / Media',
  'Construction', 'Transportation / Logistics', 'Agriculture', 'Other',
];

const STARTER_SECTIONS = [
  'Executive Summary',
  'Competitor Analysis (5-10 real competitors)',
  'Market Size & Growth Data',
  'Target Customer Profile',
  '3-Year Financial Projections',
  'Marketing & Sales Strategy',
  'Professional PDF Download',
];

const PRO_EXTRAS = [
  'Operations Plan & Key Milestones',
  'Risk Analysis & Mitigation Strategies',
  '100% Money-Back Guarantee',
  'Priority generation',
];

function GeneratePageInner() {
  const searchParams = useSearchParams();
  const [tier, setTier] = useState<'starter' | 'pro'>('pro');
  const [form, setForm] = useState<FormData>({
    businessName: '', industry: '', description: '', targetMarket: '',
    revenueModel: '', location: '', investment: '', competitors: '', email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    const t = searchParams.get('tier');
    if (t === 'starter' || t === 'pro') setTier(t);
    if (searchParams.get('cancelled') === 'true') setShowRecovery(true);
    const ind = searchParams.get('industry');
    if (ind) update('industry' as any, ind);
  }, [searchParams]);

  const update = (field: keyof FormData, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const price = tier === 'starter' ? 97 : 147;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fire Meta Pixel InitiateCheckout event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_name: form.businessName,
          content_category: 'business_plan',
          currency: 'USD',
          value: price,
        });
      }

      const language = typeof window !== 'undefined' ? localStorage.getItem('bizplan-language') || 'en' : 'en';

      // Schedule abandoned checkout email (cancelled if they complete purchase)
      if (form.email) {
        fetch('/api/email-scheduler', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'schedule_abandoned', email: form.email, businessName: form.businessName }),
        }).catch(() => {});
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tier, language }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500">Step 1 of 2: Describe Your Business</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Abandoned checkout recovery */}
        {showRecovery && (
          <div className="mb-6 p-5 rounded-xl bg-amber-50 border-2 border-amber-200 relative">
            <button onClick={() => setShowRecovery(false)} className="absolute top-3 right-3 text-amber-400 hover:text-amber-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="font-bold text-amber-900 mb-1">Still thinking it over?</h3>
            <p className="text-sm text-amber-800 mb-3">
              You were one step away from your business plan. No worries, your form data is still here. If you're not ready to commit, try our free tool first:
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="/free-competitor-check" className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition">
                Free Competitor Check
              </a>
              <a href="/bundles" className="px-4 py-2 border border-amber-300 text-amber-800 text-sm font-semibold rounded-lg hover:bg-amber-100 transition">
                See Bundle Deals
              </a>
            </div>
          </div>
        )}

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'].map((c, i) => (
                <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-white`} />
              ))}
            </div>
            <span className="font-medium text-gray-700">87% choose Pro</span>
          </div>
          <span className="text-gray-300">|</span>
          <span>Plans delivered in 3-8 min</span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Real data, not AI guesses</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Describe Your Idea. We Build Your Business.</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Your business plan is just the beginning. Fill this out once, and it powers everything.
          </p>

          {/* The pipeline explanation */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5 max-w-xl mx-auto text-left">
            <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">Here is what happens next</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-extrabold">1</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">We spy on your competitors</p>
                  <p className="text-xs text-gray-500">We find real businesses in your market, analyze their pricing, strengths, and weaknesses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-extrabold">2</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">We write your business plan using that intelligence</p>
                  <p className="text-xs text-gray-500">Financial projections, marketing strategy, and a roadmap built on real data, not guesses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center text-sm font-extrabold">3</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">One click: we build your website from the plan</p>
                  <p className="text-xs text-gray-500">Your site already speaks to your market because it was built from real competitive research</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-extrabold">4</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">One click: pitch deck, brand kit, ad copy, and more</p>
                  <p className="text-xs text-gray-500">Everything is connected. Describe your business once, build everything from it</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Or just use the plan on its own for investors, banks, or to guide your launch. It works either way.
              </p>
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Real competitor data
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Ready in under 10 minutes
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Powers your website + pitch deck
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              One-time payment
            </span>
          </div>
        </div>

        {/* Tier Selector */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Choose Your Plan</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTier('starter')}
              className={`p-4 rounded-xl border-2 text-left transition ${
                tier === 'starter'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-bold text-lg">Starter</span>
                <span className="text-2xl font-extrabold">$97</span>
              </div>
              <p className="text-xs text-gray-500">7-section business plan with real market research</p>
            </button>
            <button
              type="button"
              onClick={() => setTier('pro')}
              className={`p-4 rounded-xl border-2 text-left transition relative ${
                tier === 'pro'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-bold rounded-full uppercase">Best Value</div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-bold text-lg">Pro</span>
                <span className="text-2xl font-extrabold">$147</span>
              </div>
              <p className="text-xs text-gray-500">Full plan + Operations, Risk Analysis & Money-Back Guarantee</p>
            </button>
          </div>

          {/* What's included */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {tier === 'starter' ? 'Included in Starter:' : 'Included in Pro:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {STARTER_SECTIONS.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {s}
                </div>
              ))}
              {tier === 'pro' && PRO_EXTRAS.map((s, i) => (
                <div key={`pro-${i}`} className="flex items-center gap-1.5 text-xs text-brand-700 font-medium">
                  <svg className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name *</label>
            <input
              type="text"
              required
              value={form.businessName}
              onChange={e => update('businessName', e.target.value)}
              placeholder="e.g., FreshBite Meal Delivery"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry *</label>
            <select
              required
              value={form.industry}
              onChange={e => update('industry', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white"
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Describe Your Business Idea *
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="What does your business do? What problem does it solve? What makes it unique? Be as detailed as possible..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
            />
          </div>

          {/* Target Market */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Market *</label>
            <textarea
              required
              rows={2}
              value={form.targetMarket}
              onChange={e => update('targetMarket', e.target.value)}
              placeholder="Who are your ideal customers? Age, location, income, interests, pain points..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
            />
          </div>

          {/* Revenue Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Revenue Model *</label>
            <input
              type="text"
              required
              value={form.revenueModel}
              onChange={e => update('revenueModel', e.target.value)}
              placeholder="e.g., Monthly subscription $29/mo, one-time purchase, freemium..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => update('location', e.target.value)}
                placeholder="e.g., Online / USA / New York"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
              />
            </div>
            {/* Startup Investment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Startup Budget</label>
              <input
                type="text"
                value={form.investment}
                onChange={e => update('investment', e.target.value)}
                placeholder="e.g., $5,000 / $50,000 / Bootstrapped"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
              />
            </div>
          </div>

          {/* Known Competitors */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Known Competitors <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={form.competitors}
              onChange={e => update('competitors', e.target.value)}
              placeholder="List any competitors you know about. We'll find more during our research..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="your@email.com - we'll send your plan here"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">Your business plan will be delivered to this email. We never spam.</p>
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
              {loading ? 'Processing...' : `Continue to Payment - $${price}`}
            </button>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure Payment
              </span>
              <span>|</span>
              <span>Powered by Stripe</span>
              <span>|</span>
              <span>{tier === 'pro' ? 'Money-back Guarantee' : 'No subscription'}</span>
            </div>
          </div>
        </form>

        {/* What you'll receive */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-3 text-center">What you get in under 10 minutes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-4">
            <div className="p-3">
              <p className="text-2xl font-extrabold text-brand-600">5-10</p>
              <p className="text-xs text-gray-500">Real competitors analyzed</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-extrabold text-brand-600">3-Year</p>
              <p className="text-xs text-gray-500">Financial projections</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-extrabold text-brand-600">PDF</p>
              <p className="text-xs text-gray-500">Investor-ready download</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-center text-gray-700 mb-2">Then, from your dashboard, one click to:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-accent-50 text-accent-700 text-xs font-semibold rounded-full border border-accent-200">Build Your Website</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">Create Pitch Deck</span>
              <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-200">Generate Brand Kit</span>
              <span className="px-3 py-1 bg-pink-50 text-pink-700 text-xs font-semibold rounded-full border border-pink-200">Get Social Content</span>
              <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">Write Ad Copy</span>
            </div>
          </div>
        </div>

        {/* Not ready? */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Not ready to buy? <a href="/free-competitor-check" className="text-brand-600 underline hover:text-brand-700">Try our free competitor check first</a>
        </div>
      </main>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <GeneratePageInner />
    </Suspense>
  );
}
