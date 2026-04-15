'use client';

import { useState } from 'react';

interface DomainSuggestion { domain: string; available: string; registrar: string; yearlyPrice: string; }
interface Step { stepNumber: number; title: string; instructions: string; tip: string; }
interface GuideData {
  businessName: string;
  domainSuggestions: DomainSuggestion[];
  recommendedDomain: string;
  buyDomainSteps: Step[];
  connectDomainSteps: { vercel: Step[]; netlify: Step[]; cloudflarePages: Step[]; ownHosting: Step[]; };
  setupEmailSteps: Step[];
  sslSteps: Step[];
  totalEstimatedCost: string;
  cheapestOption: string;
}

export default function DomainGuidePage() {
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<GuideData | null>(null);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<'domain' | 'hosting' | 'email' | 'ssl'>('domain');
  const [hostingChoice, setHostingChoice] = useState<'vercel' | 'netlify' | 'cloudflarePages' | 'ownHosting'>('cloudflarePages');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/domain-guide', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGuide(data);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const renderSteps = (steps: Step[], prefix: string) => (
    <div className="space-y-4">
      {(steps || []).map((step, i) => {
        const id = `${prefix}-${i}`;
        const done = completedSteps.has(id);
        return (
          <div key={i} className={`rounded-xl border-2 overflow-hidden transition ${done ? 'border-green-200 bg-green-50/50' : 'border-gray-100'}`}>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <button onClick={() => toggleStep(id)}
                  className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition mt-0.5 ${
                    done ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-brand-400'
                  }`}>
                  {done && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  {!done && <span className="text-xs font-bold text-gray-400">{step.stepNumber}</span>}
                </button>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm mb-2 ${done ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                    Step {step.stepNumber}: {step.title}
                  </h3>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{step.instructions}</div>
                  {step.tip && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <p className="text-xs text-amber-800"><span className="font-bold">Tip:</span> {step.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Get Your Website Live</h1>
            <p className="text-gray-600 text-lg">We'll give you a personalized, step-by-step guide to buy a domain and put your website online. Written so anyone can follow along.</p>
          </div>

          <div className="bg-white rounded-2xl border p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">What this guide covers</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🌐', title: 'Buy Your Domain', desc: 'Get yourname.com for $9-12/year. We suggest the best name and cheapest registrar.' },
                { icon: '🚀', title: 'Free Hosting', desc: 'Upload your website for free using Cloudflare Pages, Vercel, or Netlify. $0/month.' },
                { icon: '📧', title: 'Business Email', desc: 'Set up name@yourbusiness.com. Free with Zoho or $6/mo with Google.' },
                { icon: '🔒', title: 'SSL / HTTPS', desc: 'Make sure your site shows the padlock. Most free hosts do this automatically.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">Total cost: <span className="font-bold text-green-600">$9/year</span> (domain only, hosting is free)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Business Name *</label>
              <input type="text" required value={businessName} onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g., FreshBite Delivery, Bloom Beauty Salon..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition" />
              <p className="text-xs text-gray-400 mt-1">We'll suggest domain names based on this</p>
            </div>
            {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60">
              {loading ? 'Generating your guide...' : 'Get My Setup Guide - Free'}
            </button>
          </form>
        </main>
      </div>
    );
  }

  // Guide result
  const sections = [
    { key: 'domain' as const, label: '1. Buy Domain', icon: '🌐' },
    { key: 'hosting' as const, label: '2. Set Up Hosting', icon: '🚀' },
    { key: 'email' as const, label: '3. Business Email', icon: '📧' },
    { key: 'ssl' as const, label: '4. SSL / HTTPS', icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Setup Guide: {guide.businessName}</h1>
          <p className="text-sm text-gray-500">Follow each step in order. Check them off as you go.</p>
          <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-sm text-green-800"><span className="font-bold">Cheapest option:</span> {guide.cheapestOption}</p>
          </div>
        </div>

        {/* Domain suggestions */}
        <div className="bg-white rounded-2xl border p-5 mb-6">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Suggested domain names for your business</h3>
          <div className="space-y-2">
            {(guide.domainSuggestions || []).map((d, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg border transition ${
                d.domain === guide.recommendedDomain ? 'border-brand-300 bg-brand-50' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  {d.domain === guide.recommendedDomain && <span className="text-[10px] font-bold text-white bg-brand-600 px-2 py-0.5 rounded-full">Recommended</span>}
                  <span className="font-mono font-bold text-gray-900">{d.domain}</span>
                </div>
                <span className="text-sm text-gray-500">{d.yearlyPrice}/year</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {sections.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                activeSection === s.key ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Domain steps */}
        {activeSection === 'domain' && renderSteps(guide.buyDomainSteps, 'domain')}

        {/* Hosting steps */}
        {activeSection === 'hosting' && (
          <div>
            <div className="bg-white rounded-xl border p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Where do you want to host? (all free)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'cloudflarePages' as const, label: 'Cloudflare Pages', desc: 'Easiest, fastest' },
                  { key: 'vercel' as const, label: 'Vercel', desc: 'Great for Next.js' },
                  { key: 'netlify' as const, label: 'Netlify', desc: 'Simple drag & drop' },
                  { key: 'ownHosting' as const, label: 'Other / FTP', desc: 'Traditional hosting' },
                ].map(h => (
                  <button key={h.key} onClick={() => setHostingChoice(h.key)}
                    className={`p-3 rounded-lg border-2 text-center transition ${
                      hostingChoice === h.key ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <p className="text-sm font-bold text-gray-900">{h.label}</p>
                    <p className="text-[10px] text-gray-500">{h.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {renderSteps(guide.connectDomainSteps[hostingChoice] || [], `hosting-${hostingChoice}`)}
          </div>
        )}

        {/* Email steps */}
        {activeSection === 'email' && renderSteps(guide.setupEmailSteps, 'email')}

        {/* SSL steps */}
        {activeSection === 'ssl' && renderSteps(guide.sslSteps, 'ssl')}

        {/* Cost summary */}
        <div className="mt-6 bg-white rounded-xl border p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-2">Total estimated cost</h3>
          <p className="text-sm text-gray-600">{guide.totalEstimatedCost}</p>
        </div>

        {/* Upsell */}
        <div className="mt-6 bg-brand-50 rounded-xl border border-brand-100 p-5 text-center">
          <p className="font-bold text-brand-900 text-sm mb-1">Don't have a website yet?</p>
          <p className="text-xs text-brand-700 mb-3">Our AI builds you a professional, multi-page website from your business description.</p>
          <div className="flex gap-2 justify-center">
            <a href="/build-website" className="px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition">Website Builder - $99</a>
            <a href="/bundles" className="px-4 py-2 border border-brand-300 text-brand-700 text-sm font-semibold rounded-lg hover:bg-brand-50 transition">Bundles</a>
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => { setGuide(null); setBusinessName(''); setCompletedSteps(new Set()); }}
            className="text-sm text-gray-500 hover:text-gray-700 underline">Generate for a different business</button>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
        <span className="text-sm text-gray-500">Domain & Hosting Guide</span>
      </div>
    </header>
  );
}
