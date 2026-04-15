'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'Technology / SaaS', 'E-commerce / Retail', 'Food & Beverage', 'Health & Wellness',
  'Education / EdTech', 'Finance / FinTech', 'Real Estate', 'Marketing / Agency',
  'Manufacturing', 'Consulting / Services', 'Travel / Hospitality', 'Entertainment / Media',
  'Construction', 'Transportation / Logistics', 'Agriculture', 'Other',
];

interface Props {
  productName: string;
  productPrice: number;
  checkoutEndpoint: string;
  extraFields?: Record<string, any>;
  children?: React.ReactNode;
}

export default function StandaloneBusinessForm({ productName, productPrice, checkoutEndpoint, extraFields, children }: Props) {
  const [form, setForm] = useState({
    businessName: '', industry: '', description: '', targetMarket: '',
    revenueModel: '', location: '', email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(checkoutEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...extraFields }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'Checkout failed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <span className="font-bold">No business plan needed.</span> Describe your business below and we'll generate your {productName.toLowerCase()} directly.
          Have a plan already? <a href="/generate" className="underline text-amber-700 hover:text-amber-900">Get a business plan</a> and your {productName.toLowerCase()} will be even more detailed.
        </p>
      </div>

      {children}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <p className="text-sm font-semibold text-gray-700">Tell us about your business:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name *</label>
            <input type="text" required value={form.businessName} onChange={e => update('businessName', e.target.value)}
              placeholder="e.g., FreshBite Delivery" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Industry *</label>
            <select required value={form.industry} onChange={e => update('industry', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400 transition bg-white">
              <option value="">Select</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Describe Your Business *</label>
          <textarea required rows={3} value={form.description} onChange={e => update('description', e.target.value)}
            placeholder="What does your business do? What problem does it solve?"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400 transition resize-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Target Market</label>
          <input type="text" value={form.targetMarket} onChange={e => update('targetMarket', e.target.value)}
            placeholder="Who are your ideal customers?" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400 transition" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
          <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
            placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400 transition" />
        </div>

        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        <button type="submit" disabled={loading}
          className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60">
          {loading ? 'Processing...' : `Get ${productName} - $${productPrice}`}
        </button>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span>One-time payment</span><span>|</span><span>No plan required</span><span>|</span><span>Powered by Stripe</span>
        </div>
      </form>
    </div>
  );
}
