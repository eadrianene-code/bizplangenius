'use client';

import { useState } from 'react';

interface FormData {
  businessName: string;
  industry: string;
  description: string;
  targetMarket: string;
  revenueModel: string;
  location: string;
  investment: string;
  competitors: string;
}

const INDUSTRIES = [
  'Technology / SaaS', 'E-commerce / Retail', 'Food & Beverage', 'Health & Wellness',
  'Education / EdTech', 'Finance / FinTech', 'Real Estate', 'Marketing / Agency',
  'Manufacturing', 'Consulting / Services', 'Travel / Hospitality', 'Entertainment / Media',
  'Construction', 'Transportation / Logistics', 'Agriculture', 'Other',
];

export default function GeneratePage() {
  const [form, setForm] = useState<FormData>({
    businessName: '', industry: '', description: '', targetMarket: '',
    revenueModel: '', location: '', investment: '', competitors: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof FormData, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Tell Us About Your Business</h1>
          <p className="text-gray-600 text-lg">
            The more detail you provide, the more specific and actionable your business plan will be.
          </p>
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
              {loading ? 'Processing...' : 'Continue to Payment — $49'}
            </button>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure Payment
              </span>
              <span>|</span>
              <span>Powered by Stripe</span>
              <span>|</span>
              <span>Money-back Guarantee</span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
