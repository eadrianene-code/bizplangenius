'use client';

import { useState } from 'react';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'free', label: 'Free' },
  { key: 'research', label: 'Research' },
  { key: 'plan', label: 'Plan' },
  { key: 'build', label: 'Build' },
  { key: 'brand', label: 'Brand' },
  { key: 'fundraise', label: 'Fundraise' },
  { key: 'grow', label: 'Grow' },
  { key: 'legal', label: 'Legal' },
  { key: 'bundle', label: 'Bundles' },
  { key: 'subscription', label: 'Monthly' },
];

const PRODUCTS = [
  // Free tools
  { name: 'Competitor Check', desc: 'Find your top 3 real competitors instantly', price: 'Free', href: '/free-competitor-check', category: 'free', icon: '🔍', color: 'border-green-200 bg-green-50' },
  { name: 'Idea Validator', desc: 'Score your business idea 1-10 with real market data', price: 'Free', href: '/validate-idea', category: 'free', icon: '💡', color: 'border-green-200 bg-green-50' },
  { name: 'Name Generator', desc: '10 unique business name ideas with domains', price: 'Free', href: '/business-name-generator', category: 'free', icon: '✨', color: 'border-green-200 bg-green-50' },
  { name: 'Cost Calculator', desc: 'Estimate startup costs for your business type', price: 'Free', href: '/startup-cost-calculator', category: 'free', icon: '🧮', color: 'border-green-200 bg-green-50' },
  { name: 'Launch Checklist', desc: 'Step-by-step guide to legally start your business', price: 'Free', href: '/launch-checklist', category: 'free', icon: '📝', color: 'border-green-200 bg-green-50' },
  { name: 'Domain Guide', desc: 'Buy a domain and get your website live ($9/year)', price: 'Free', href: '/domain-guide', category: 'free', icon: '🌐', color: 'border-green-200 bg-green-50' },

  // Paid products
  { name: 'Competitor Spy Report', desc: '10-15 real competitors analyzed: SWOT, pricing, vulnerabilities, 90-day roadmap', price: '$19', href: '/spy', category: 'research', icon: '🎯', color: 'border-brand-200 bg-brand-50/50' },
  { name: 'Business Plan (Starter)', desc: '7-section investor-ready PDF with real competitor data and financials', price: '$29', href: '/generate?tier=starter', category: 'plan', icon: '📋', color: 'border-brand-200 bg-brand-50/50' },
  { name: 'Business Plan (Pro)', desc: '9-section plan: everything in Starter + operations, risk analysis, money-back guarantee', price: '$49', href: '/generate?tier=pro', category: 'plan', icon: '📋', color: 'border-brand-200 bg-brand-50/50', popular: true },
  { name: 'Website Builder', desc: '6 types (store, restaurant, SaaS, booking, portfolio, landing). Multi-page, editable, payments wired in', price: 'From $99', href: '/build-website', category: 'build', icon: '🌐', color: 'border-accent-200 bg-accent-50/50' },
  { name: 'Logo & Brand Kit', desc: '3 logo concepts, 5-color palette, typography, brand voice, elevator pitch, social bio', price: '$29', href: '/brand-kit', category: 'brand', icon: '🎨', color: 'border-orange-200 bg-orange-50/50' },
  { name: 'Legal Pages', desc: 'Terms of Service + Privacy Policy + Cookie Policy. GDPR and CCPA compliant', price: '$19', href: '/legal-pages', category: 'legal', icon: '📜', color: 'border-gray-200 bg-gray-50' },
  { name: 'Pitch Deck', desc: '12 investor slides with speaker notes: problem, solution, market, financials, the ask', price: '$39', href: '/pitch-deck', category: 'fundraise', icon: '🎯', color: 'border-purple-200 bg-purple-50/50' },
  { name: 'Investor Email Templates', desc: '10 fundraising emails: cold outreach, follow-ups, intros, updates, rejection response', price: '$19', href: '/investor-emails', category: 'fundraise', icon: '📧', color: 'border-indigo-200 bg-indigo-50/50' },
  { name: 'Social Media Pack', desc: '30 days of posts for Twitter, LinkedIn, Instagram, Facebook with hashtags and image ideas', price: '$29', href: '/social-pack', category: 'grow', icon: '📱', color: 'border-pink-200 bg-pink-50/50' },
  { name: 'Ad Copy Generator', desc: '15 ads for Google, Facebook, Instagram. Headlines, copy, keywords, targeting, creative ideas', price: '$19', href: '/ad-copy', category: 'grow', icon: '📢', color: 'border-red-200 bg-red-50/50' },

  // Bundles
  { name: 'Starter Bundle', desc: 'Competitor Spy + Pro Business Plan', price: '$59', href: '/bundles', category: 'bundle', icon: '📦', color: 'border-brand-200 bg-brand-50/50', savings: 'Save $9' },
  { name: 'Launch Pack', desc: 'Spy + Pro Plan + Website + Pitch Deck', price: '$199', href: '/bundles', category: 'bundle', icon: '🚀', color: 'border-accent-200 bg-accent-50/50', savings: 'Save $68', popular: true },
  { name: 'Full Business Kit', desc: 'Everything: Spy + Plan + Website + Pitch + Social + Brand', price: '$349', href: '/bundles', category: 'bundle', icon: '💼', color: 'border-purple-200 bg-purple-50/50', savings: 'Save $25+' },

  // Subscriptions
  { name: 'Competitor Monitoring', desc: 'Updated spy report every 30 days + new competitor alerts', price: '$15/mo', href: '/monitoring', category: 'subscription', icon: '📊', color: 'border-accent-200 bg-accent-50/50' },
  { name: 'Monthly Social Pack', desc: '30 new posts delivered every month, always fresh', price: '$19/mo', href: '/monitoring', category: 'subscription', icon: '📱', color: 'border-pink-200 bg-pink-50/50' },
  { name: 'Website Hosting', desc: 'Your website hosted live with custom domain and SSL', price: '$19/mo', href: '/monitoring', category: 'subscription', icon: '☁️', color: 'border-accent-200 bg-accent-50/50' },
];

export default function ProductsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">All Products & Tools</h1>
          <p className="text-gray-600">Everything you need to go from idea to running business. Start free, build as you go.</p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setFilter(cat.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filter === cat.key ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product, i) => (
            <a key={i} href={product.href}
              className={`p-5 rounded-xl border ${product.color} hover:shadow-lg transition block relative`}>
              {(product as any).popular && (
                <span className="absolute -top-2 right-3 text-[10px] font-bold text-white bg-brand-600 px-2 py-0.5 rounded-full">Popular</span>
              )}
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{product.icon}</span>
                <div className="text-right">
                  <span className={`text-sm font-extrabold ${product.price === 'Free' ? 'text-green-600' : 'text-gray-900'}`}>{product.price}</span>
                  {(product as any).savings && (
                    <p className="text-[10px] text-green-600 font-bold">{(product as any).savings}</p>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{product.desc}</p>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Not sure where to start?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/free-competitor-check" className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">Try Free Competitor Check</a>
            <a href="/bundles" className="px-6 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition">See Bundle Deals</a>
          </div>
        </div>
      </main>
    </div>
  );
}
