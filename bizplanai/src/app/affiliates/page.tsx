'use client';

import { useState } from 'react';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  commissionRate: number;
  clicks: number;
  conversions: number;
  totalEarned: number;
  payouts: number;
  createdAt: string;
  status: string;
}

const PROMO_MESSAGES = [
  'I found an AI tool that creates business plans with real competitor data in minutes. Use my link for the best deal:',
  'If you\'re starting a business, check out BizPlan Genius. They research your actual competitors and build an investor-ready plan. Here\'s my link:',
  'This tool saved me weeks of work. AI business plans, websites, pitch decks, all from one description. Try it:',
];

export default function AffiliatesPage() {
  const [view, setView] = useState<'landing' | 'apply' | 'dashboard'>('landing');
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [form, setForm] = useState({ name: '', email: '', website: '', audience: '', howPromote: '' });
  const [loginEmail, setLoginEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply', ...form }),
      });
      const data = await res.json();
      if (data.error && !data.affiliate) throw new Error(data.error);
      setAffiliate(data.affiliate);
      setView('dashboard');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dashboard', email: loginEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Not found');
      setAffiliate(data.affiliate);
      setView('dashboard');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const affiliateUrl = affiliate ? `https://www.bizplangenius.com/?aff=${affiliate.code}` : '';
  const copyLink = () => { navigator.clipboard.writeText(affiliateUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  // Landing
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Earn 20% on Every Sale</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join the BizPlan Genius affiliate program. Share your unique link, and earn 20% commission on every product someone buys through it.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
            {[
              { step: '1', title: 'Apply', desc: 'Fill out a quick form and get your affiliate link instantly' },
              { step: '2', title: 'Share', desc: 'Share your link on social media, your website, or with your audience' },
              { step: '3', title: 'Earn', desc: '20% of every sale made through your link goes to you' },
              { step: '4', title: 'Get Paid', desc: 'Monthly payouts via PayPal or bank transfer' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-600 font-bold text-lg">{s.step}</div>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Commission examples */}
          <div className="bg-white rounded-2xl border p-6 mb-12">
            <h3 className="font-bold text-gray-900 mb-4 text-center">What you could earn</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { product: 'Spy Report ($97)', commission: '$19.40' },
                { product: 'Pro Plan ($147)', commission: '$29.40' },
                { product: 'Launch Pack ($297)', commission: '$59.40' },
                { product: 'Full Kit ($397)', commission: '$79.40' },
              ].map((p, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">{p.product}</p>
                  <p className="text-2xl font-extrabold text-green-600">{p.commission}</p>
                  <p className="text-xs text-gray-400">per sale</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">10 Launch Pack referrals = <span className="font-bold text-green-600">$398/month</span></p>
          </div>

          {/* Who it's for */}
          <div className="bg-white rounded-2xl border p-6 mb-12">
            <h3 className="font-bold text-gray-900 mb-4 text-center">Perfect for</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { title: 'Business Consultants', desc: 'Recommend to your clients alongside your advisory services' },
                { title: 'YouTubers & Bloggers', desc: 'Review our tools and earn from your content' },
                { title: 'Startup Accelerators', desc: 'Give your cohort access to business planning tools' },
                { title: 'Freelancers', desc: 'Offer business plans as a value-add to your services' },
                { title: 'Social Media Influencers', desc: 'Share with your founder audience' },
                { title: 'Anyone', desc: 'Know someone starting a business? Send them our way' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-bold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setView('apply')} className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg">
              Apply Now (It's Free)
            </button>
            <button onClick={() => setView('dashboard')} className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-brand-300 transition text-lg">
              Already an affiliate? Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Apply form
  if (view === 'apply') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-lg mx-auto px-4 py-12">
          <button onClick={() => setView('landing')} className="text-sm text-gray-500 hover:text-gray-700 mb-6 block">&larr; Back</button>
          <h1 className="text-2xl font-bold mb-6">Apply to be an Affiliate</h1>
          <form onSubmit={handleApply} className="bg-white rounded-2xl border p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Website or Social Media</label>
              <input type="text" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
                placeholder="https://..." className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Audience Size (estimate)</label>
              <input type="text" value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}
                placeholder="e.g., 5,000 newsletter subscribers" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">How will you promote BizPlan Genius?</label>
              <textarea rows={3} value={form.howPromote} onChange={e => setForm({ ...form, howPromote: e.target.value })}
                placeholder="e.g., Blog review, YouTube video, newsletter mention..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400 resize-none" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition disabled:opacity-60">
              {loading ? 'Submitting...' : 'Apply & Get My Link'}
            </button>
          </form>
        </main>
      </div>
    );
  }

  // Dashboard (login or view)
  if (view === 'dashboard' && !affiliate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto px-4 py-20">
          <button onClick={() => setView('landing')} className="text-sm text-gray-500 hover:text-gray-700 mb-6 block">&larr; Back</button>
          <h1 className="text-2xl font-bold mb-6">Affiliate Dashboard</h1>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl border p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Your Email</label>
              <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-brand-400" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition disabled:opacity-60">
              {loading ? 'Loading...' : 'View Dashboard'}
            </button>
            <p className="text-center text-xs text-gray-400">Not an affiliate? <button onClick={() => setView('apply')} className="text-brand-600 underline">Apply now</button></p>
          </form>
        </main>
      </div>
    );
  }

  // Dashboard view
  if (affiliate) {
    const pendingEarnings = affiliate.totalEarned - affiliate.payouts;
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Affiliate Dashboard</h1>
          <p className="text-gray-500 text-sm mb-6">Welcome back, {affiliate.name}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border p-5 text-center">
              <p className="text-2xl font-extrabold text-gray-900">{affiliate.clicks}</p>
              <p className="text-xs text-gray-500">Clicks</p>
            </div>
            <div className="bg-white rounded-xl border p-5 text-center">
              <p className="text-2xl font-extrabold text-gray-900">{affiliate.conversions}</p>
              <p className="text-xs text-gray-500">Sales</p>
            </div>
            <div className="bg-white rounded-xl border p-5 text-center">
              <p className="text-2xl font-extrabold text-green-600">${affiliate.totalEarned.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Total Earned</p>
            </div>
            <div className="bg-white rounded-xl border p-5 text-center">
              <p className="text-2xl font-extrabold text-brand-600">${pendingEarnings.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Pending Payout</p>
            </div>
          </div>

          {/* Affiliate link */}
          <div className="bg-white rounded-2xl border p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Your Affiliate Link</h3>
            <div className="flex gap-2 mb-2">
              <input type="text" readOnly value={affiliateUrl}
                className="flex-1 px-4 py-3 bg-gray-50 border rounded-lg text-sm font-mono text-gray-700" />
              <button onClick={copyLink}
                className={`px-4 py-3 rounded-lg font-semibold text-sm transition ${copied ? 'bg-green-100 text-green-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-400">Commission rate: <span className="font-bold text-green-600">{affiliate.commissionRate}%</span> on all products</p>
          </div>

          {/* Share buttons */}
          <div className="bg-white rounded-2xl border p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Share</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(PROMO_MESSAGES[0] + ' ' + affiliateUrl)}`, color: 'bg-gray-900' },
                { name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(affiliateUrl)}`, color: 'bg-blue-700' },
                { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateUrl)}`, color: 'bg-blue-600' },
                { name: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(PROMO_MESSAGES[1] + ' ' + affiliateUrl)}`, color: 'bg-green-600' },
                { name: 'Email', url: `mailto:?subject=Check out BizPlan Genius&body=${encodeURIComponent(PROMO_MESSAGES[2] + '\n\n' + affiliateUrl)}`, color: 'bg-gray-600' },
              ].map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className={`px-4 py-2 ${s.color} text-white text-sm font-medium rounded-lg hover:opacity-90 transition`}>
                  {s.name}
                </a>
              ))}
            </div>

            {/* Copy-paste messages */}
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Copy-paste messages</p>
            <div className="space-y-2">
              {PROMO_MESSAGES.map((msg, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-start justify-between gap-2">
                  <p className="text-xs text-gray-700">{msg} {affiliateUrl}</p>
                  <button onClick={() => navigator.clipboard.writeText(msg + ' ' + affiliateUrl)}
                    className="text-xs text-brand-600 font-semibold whitespace-nowrap hover:text-brand-700">Copy</button>
                </div>
              ))}
            </div>
          </div>

          {/* Commission table */}
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-bold text-gray-900 mb-3">Your Commission Per Product</h3>
            <div className="space-y-2">
              {[
                { name: 'Spy Report', price: 97 }, { name: 'Investor Emails', price: 19 },
                { name: 'Business Plan Starter', price: 97 }, { name: 'Social Pack', price: 29 },
                { name: 'Brand Kit', price: 29 }, { name: 'Pitch Deck', price: 39 },
                { name: 'Business Plan Pro', price: 147 }, { name: 'Website Builder', price: 99 },
                { name: 'Starter Bundle', price: 197 }, { name: 'Launch Pack', price: 297 },
                { name: 'Full Business Kit', price: 397 },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                  <span className="text-gray-700">{p.name} (${p.price})</span>
                  <span className="font-bold text-green-600">${(p.price * affiliate.commissionRate / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
        <span className="text-sm text-gray-500">Affiliate Program</span>
      </div>
    </header>
  );
}
