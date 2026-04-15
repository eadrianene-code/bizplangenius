'use client';

import { useState } from 'react';

const PLANS = [
  {
    key: 'monitoring_monthly',
    name: 'Competitor Monitoring',
    interval: 'Monthly',
    price: 15,
    priceLabel: '$15/mo',
    originalPrice: null,
    features: [
      'Updated spy report every 30 days',
      'Track 10-15 competitors continuously',
      'Alerts when competitors change pricing',
      'New competitor detection',
      'Monthly market trend summary',
      'Cancel anytime',
    ],
    popular: true,
    color: 'border-brand-600 bg-brand-50/30',
    badge: 'Most Popular',
  },
  {
    key: 'monitoring_yearly',
    name: 'Competitor Monitoring',
    interval: 'Yearly',
    price: 108,
    priceLabel: '$9/mo',
    originalPrice: '$15/mo',
    features: [
      'Everything in monthly, plus:',
      'Save $72/year (40% off)',
      'Priority report generation',
      'Quarterly deep-dive report',
    ],
    popular: false,
    color: 'border-accent-300 bg-accent-50/30',
    badge: 'Best Value',
  },
  {
    key: 'social_monthly',
    name: 'Monthly Social Pack',
    interval: 'Monthly',
    price: 19,
    priceLabel: '$19/mo',
    originalPrice: null,
    features: [
      '30 new posts every month',
      'Twitter, LinkedIn, Instagram, Facebook',
      'Hashtags and image suggestions',
      'Seasonal and trending content',
      'CSV download for scheduling',
      'Cancel anytime',
    ],
    popular: false,
    color: 'border-pink-300 bg-pink-50/30',
    badge: null,
  },
  {
    key: 'social_yearly',
    name: 'Monthly Social Pack',
    interval: 'Yearly',
    price: 144,
    priceLabel: '$12/mo',
    originalPrice: '$19/mo',
    features: [
      'Everything in monthly, plus:',
      'Save $84/year (37% off)',
      'Priority generation',
      'Bonus: quarterly content strategy refresh',
    ],
    popular: false,
    color: 'border-pink-300 bg-pink-50/30',
    badge: 'Save 37%',
  },
];

export default function MonitoringPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [manageEmail, setManageEmail] = useState('');
  const [manageLoading, setManageLoading] = useState(false);

  const handleSubscribe = async (planKey: string) => {
    if (!email) { setError('Please enter your email'); return; }
    setLoading(planKey);
    setError('');
    try {
      const res = await fetch('/api/monitoring-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: planKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'Checkout failed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleManage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageEmail) return;
    setManageLoading(true);
    try {
      const res = await fetch('/api/monitoring-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: manageEmail }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'No subscription found');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setManageLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500">Subscriptions</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-accent-50 text-accent-700 text-sm font-medium rounded-full mb-4 border border-accent-200">
            Recurring Revenue Products
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Stay Ahead, Every Month</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Markets change. Competitors change. Stay updated with monthly intelligence and fresh content delivered automatically.
          </p>
        </div>

        {/* Email input */}
        <div className="max-w-md mx-auto mb-10">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-center">Your email to subscribe</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition text-center"
          />
          {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}
        </div>

        {/* Competitor Monitoring */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Competitor Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PLANS.filter(p => p.key.startsWith('monitoring')).map(plan => (
              <div key={plan.key} className={`rounded-2xl border-2 ${plan.color} p-6 relative`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-full uppercase">{plan.badge}</div>
                )}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500 mb-1">{plan.interval}</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.priceLabel}</span>
                    {plan.originalPrice && <span className="text-gray-400 line-through">{plan.originalPrice}</span>}
                  </div>
                  {plan.interval === 'Yearly' && <p className="text-xs text-gray-500 mt-1">Billed {plan.price === 108 ? '$108' : '$144'}/year</p>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={loading === plan.key}
                  className="w-full px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition disabled:opacity-60"
                >
                  {loading === plan.key ? 'Processing...' : `Subscribe - ${plan.priceLabel}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Social Pack */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Monthly Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PLANS.filter(p => p.key.startsWith('social')).map(plan => (
              <div key={plan.key} className={`rounded-2xl border-2 ${plan.color} p-6 relative`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-pink-600 text-white text-xs font-bold rounded-full uppercase">{plan.badge}</div>
                )}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500 mb-1">{plan.interval}</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.priceLabel}</span>
                    {plan.originalPrice && <span className="text-gray-400 line-through">{plan.originalPrice}</span>}
                  </div>
                  {plan.interval === 'Yearly' && <p className="text-xs text-gray-500 mt-1">Billed $144/year</p>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={loading === plan.key}
                  className="w-full px-6 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition disabled:opacity-60"
                >
                  {loading === plan.key ? 'Processing...' : `Subscribe - ${plan.priceLabel}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Compare */}
        <div className="max-w-3xl mx-auto mb-12 bg-white rounded-2xl border p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-center">One-time vs Subscription</h3>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div></div>
            <div className="font-bold text-gray-900">One-time</div>
            <div className="font-bold text-brand-600">Subscription</div>
            <div className="text-left text-gray-600">Spy Report</div>
            <div className="text-gray-500">1 report, $19</div>
            <div className="text-brand-600 font-semibold">Updated monthly, $15/mo</div>
            <div className="text-left text-gray-600">Social Pack</div>
            <div className="text-gray-500">30 posts, $29</div>
            <div className="text-brand-600 font-semibold">30 new posts/mo, $19/mo</div>
            <div className="text-left text-gray-600">Data freshness</div>
            <div className="text-gray-500">Point in time</div>
            <div className="text-brand-600 font-semibold">Always current</div>
          </div>
        </div>

        {/* Manage subscription */}
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm text-gray-500 mb-3">Already subscribed?</p>
          <form onSubmit={handleManage} className="flex gap-2">
            <input
              type="email"
              value={manageEmail}
              onChange={e => setManageEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none"
            />
            <button
              type="submit"
              disabled={manageLoading}
              className="px-4 py-2 text-sm font-semibold text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition disabled:opacity-60"
            >
              {manageLoading ? '...' : 'Manage Subscription'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
