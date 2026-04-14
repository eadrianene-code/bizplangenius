'use client';

import { useState } from 'react';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/spy', label: 'Competitor Spy' },
  { href: '/blog', label: 'Blog' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/about', label: 'About' },
];

const FEATURES = [
  {
    icon: '🔍',
    title: 'Real Competitor Research',
    desc: 'We analyze your actual competitors: their pricing, positioning, strengths, and weaknesses. No generic filler.',
  },
  {
    icon: '📊',
    title: 'Live Market Data',
    desc: 'Get real market size estimates, growth trends, and industry benchmarks pulled from current sources.',
  },
  {
    icon: '💰',
    title: 'Financial Projections',
    desc: 'Revenue forecasts, cost breakdowns, break-even analysis, and cash flow projections based on real industry margins.',
  },
  {
    icon: '🎯',
    title: 'Marketing Strategy',
    desc: 'Channel recommendations, customer acquisition costs, and a go-to-market playbook tailored to your niche.',
  },
  {
    icon: '📄',
    title: 'Investor-Ready PDF',
    desc: 'Download a beautifully formatted PDF ready to show banks, investors, or partners. Professional and polished.',
  },
  {
    icon: '⚡',
    title: 'Minutes, Not Weeks',
    desc: 'Traditional business plans take 40+ hours. Ours takes under 10 minutes. Same quality, fraction of the time.',
  },
];

const STEPS = [
  { num: '1', title: 'Describe Your Business', desc: 'Tell us your business idea, target market, and goals. The more detail, the better your plan.' },
  { num: '2', title: 'We Research Your Market', desc: 'Our AI analyzes real competitors, market trends, and industry data specific to YOUR business.' },
  { num: '3', title: 'Get Your Business Plan', desc: 'Download a complete, investor-ready business plan as a professional PDF. Ready in minutes.' },
];

const FAQS = [
  {
    q: 'How is this different from ChatGPT?',
    a: 'ChatGPT gives you generic templates with made-up data. We research your ACTUAL competitors, pull real market data, and generate financial projections based on real industry benchmarks. The result is a plan you can hand to a bank or investor.',
  },
  {
    q: 'How long does it take to generate a plan?',
    a: 'Most plans are generated in 3-8 minutes depending on the complexity of your business. Traditional consultants charge $2,000-$10,000 and take weeks.',
  },
  {
    q: 'Can I use this for a bank loan application?',
    a: 'Yes. Our plans include all the sections banks typically require: executive summary, market analysis, financial projections, competitive landscape, and operational plan.',
  },
  {
    q: 'What if I\'m not satisfied with the plan?',
    a: 'We offer one free revision. If you\'re still not happy, we\'ll refund your purchase. No questions asked.',
  },
  {
    q: 'Do you store my business idea?',
    a: 'We take privacy seriously. Your business details are used only to generate your plan and are not shared with anyone or used for any other purpose.',
  },
];

function PHBanner() {
  return (
    <a
      href="https://www.producthunt.com/products/competitor-spy?utm_source=bizplangenius&utm_medium=banner"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-center text-sm font-semibold py-2 px-4 hover:from-orange-600 hover:to-red-600 transition"
    >
      Competitor Spy is LIVE on Product Hunt today. Tap to upvote and support us 🧡
    </a>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <PHBanner />
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-brand-600 transition">{l.label}</a>
          ))}
          <a href="#pricing" className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition shadow-md shadow-brand-600/20">
            Generate Your Plan
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
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2">{l.label}</a>
          ))}
          <a href="#pricing" className="block w-full text-center px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-lg">
            Generate Your Plan
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
        <div className="inline-block px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-medium rounded-full mb-6 border border-brand-100">
          AI-Powered Business Plans with Real Data
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Business Plans with{' '}
          <span className="text-gradient">Real Market Research</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
          Describe your business idea. Our AI researches your actual competitors,
          analyzes real market data, and generates an investor-ready business plan
          in minutes, not weeks.
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-10">
          Powered by Google Gemini 2.5 with live web search.{' '}
          <a href="/methodology" className="text-brand-600 hover:text-brand-700 underline">See how it works</a>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#pricing" className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg">
            Generate My Business Plan - Starting at $29
          </a>
          <a href="#how-it-works" className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-brand-300 hover:text-brand-600 transition text-lg">
            See How It Works
          </a>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          One-time payment. No subscription. 100% money-back guarantee.
        </div>
        <p className="mt-3 text-sm text-brand-600 font-medium">
          <a href="/sample-business-plan.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-700">
            See a real sample plan
          </a>
        </p>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: '🔎', title: 'Real-time web data', desc: 'Live Google Search grounding on every plan' },
    { icon: '⚡', title: '8 minutes, not 8 weeks', desc: 'Full investor-ready PDF in under 10 min' },
    { icon: '💸', title: 'One-time payment', desc: 'No subscriptions, no upsells, no surprises' },
    { icon: '🛡️', title: 'Money-back guarantee', desc: 'Refund if the data is not real, no questions' },
  ];
  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <div key={i} className="text-center md:text-left flex md:items-start gap-3 flex-col md:flex-row">
              <div className="text-2xl mx-auto md:mx-0">{it.icon}</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{it.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonBanner() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-red-500 line-through">$2,000-$10,000</p>
            <p className="text-gray-500 mt-1">Business plan consultant</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-500 line-through">40+ hours</p>
            <p className="text-gray-500 mt-1">DIY with templates</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent-500">From $29, 10 min</p>
            <p className="text-gray-500 mt-1">BizPlan Genius</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Not Just Another AI Template</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We don't generate generic filler. Every plan includes real competitor data,
            actual market research, and financial projections based on your industry.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-lg transition bg-white">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Three simple steps to your professional business plan.</p>
        </div>
        <div className="space-y-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-brand-600/25">
                {s.num}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SamplePlan() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">See What You Get</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't take our word for it. Here's a real business plan generated by BizPlan Genius
            for an artisan coffee roasting company.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
              </svg>
              <div>
                <p className="font-semibold text-gray-800">BrewCraft Artisan Coffee Roasters</p>
                <p className="text-sm text-gray-500">11-page business plan with real competitor data</p>
              </div>
            </div>
            <a
              href="/sample-business-plan.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition shadow-md shadow-brand-600/20"
            >
              View Sample Plan (PDF)
            </a>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4">What's inside this plan:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Executive Summary with mission, vision & key metrics',
                'Competitor Analysis: Trade Coffee, Blue Bottle, Atlas Coffee Club, Onyx Coffee Lab',
                'Real pricing data ($15-$30+ per bag)',
                'Market sizing with actual industry figures',
                'Target customer profile & acquisition strategy',
                'Financial projections: Year 1 ($125K) to Year 3 ($450K)',
                'Operations plan with supply chain details',
                'Risk analysis with mitigation strategies',
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
                <span className="font-semibold">Notice the difference:</span> Real competitor names with real pricing.
                Real revenue projections based on industry benchmarks. This is what separates BizPlan Genius
                from generic AI templates.
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <a href="#pricing" className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg inline-block">
            Generate Your Own Plan
          </a>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const STARTER_FEATURES = [
    'Executive Summary',
    'Real Competitor Analysis (5-10 competitors)',
    'Market Size & Growth Data',
    'Target Customer Profile',
    '3-Year Financial Projections',
    'Marketing & Sales Strategy',
    'Professional PDF Download',
  ];

  const PRO_FEATURES = [
    'Everything in Starter, plus:',
    'Operations Plan & Key Milestones',
    'Risk Analysis & Mitigation Strategies',
    '100% Money-Back Guarantee',
    'Priority generation',
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get Your Business Plan</h2>
          <p className="text-lg text-gray-600">Choose the plan that fits your needs. No subscriptions, no hidden fees.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Starter</p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-extrabold">$29</span>
                <span className="text-gray-500 line-through text-lg">$99</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">One-time payment</p>
            </div>
            <ul className="space-y-3 mb-8">
              {STARTER_FEATURES.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="/generate?tier=starter"
              className="block w-full text-center px-8 py-4 border-2 border-brand-600 text-brand-600 font-bold rounded-xl hover:bg-brand-50 transition text-lg"
            >
              Get Starter Plan
            </a>
            <p className="mt-3 text-center text-xs text-gray-500">100% money-back guarantee</p>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl border-2 border-brand-600 p-8 shadow-xl shadow-brand-600/10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">Most Popular</div>
            <div className="text-center">
              <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">Pro</p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-extrabold">$49</span>
                <span className="text-gray-500 line-through text-lg">$149</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">One-time payment</p>
            </div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  {i === 0 ? (
                    <svg className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className={i === 0 ? 'text-brand-700 font-semibold' : 'text-gray-700'}>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="/generate?tier=pro"
              className="block w-full text-center px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg"
            >
              Get Pro Plan
            </a>
            <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-sm font-semibold text-green-800">
                100% Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-20 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold hover:text-brand-600 transition"
              >
                {f.q}
                <svg className={`w-5 h-5 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpyCrossSell() {
  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <p className="text-accent-400 text-sm font-semibold uppercase tracking-wider mb-2">New Tool</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Know Your Competition Before You Write Your Plan
          </h2>
          <p className="text-gray-400 mb-4">
            Competitor Spy finds 10-15 real competitors in your market, analyzes their pricing,
            strengths, and weaknesses, then gives you a 90-day strategy to outperform them.
            Pairs perfectly with your business plan.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/spy" className="inline-block px-6 py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition shadow-lg text-sm">
              See a Sample Report
            </a>
            <span className="text-gray-500 text-sm">Just $19 per report</span>
          </div>
        </div>
        <div className="flex-shrink-0 bg-gray-800 rounded-xl p-5 border border-gray-700 w-full md:w-auto">
          <p className="text-white font-semibold text-sm mb-3">What you get:</p>
          <ul className="space-y-2">
            {['15+ competitor profiles', 'Real pricing comparison', 'SWOT analysis', 'Vulnerability audit', '90-day action plan'].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-4 h-4 text-accent-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 px-4 bg-brand-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Stop Writing Business Plans the Hard Way
        </h2>
        <p className="text-lg text-brand-100 mb-8 max-w-xl mx-auto">
          Get a professional business plan backed by real competitor data and market research.
          Ready in minutes, not weeks.
        </p>
        <a href="/generate" className="inline-block px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-lg text-lg">
          Generate My Business Plan - Starting at $29
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-gray-100 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="font-bold text-gray-900 mb-3">BizPlan Genius</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI business plans with real competitor research and market data. Not templates. Not filler. Real data you can verify.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-3">Products</p>
            <div className="space-y-2">
              <a href="/#pricing" className="block text-sm text-gray-500 hover:text-gray-700">Business Plan Generator</a>
              <a href="/spy" className="block text-sm text-gray-500 hover:text-gray-700">Competitor Spy Tool</a>
              <a href="/sample-business-plan.pdf" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 hover:text-gray-700">Sample Plan (PDF)</a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-3">Company</p>
            <div className="space-y-2">
              <a href="/about" className="block text-sm text-gray-500 hover:text-gray-700">About</a>
              <a href="/methodology" className="block text-sm text-gray-500 hover:text-gray-700">Methodology</a>
              <a href="/blog" className="block text-sm text-gray-500 hover:text-gray-700">Blog</a>
              <a href="mailto:support@bizplangenius.com" className="block text-sm text-gray-500 hover:text-gray-700">Contact</a>
              <a href="/privacy" className="block text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
              <a href="/terms" className="block text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} BizPlan Genius. All rights reserved.</p>
          <a
            href="https://www.producthunt.com/products/competitor-spy?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-competitor-spy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="Competitor Spy - Know exactly how to beat your competitors for $19 | Product Hunt"
              width={200}
              height={43}
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1122669&theme=light&t=1776151861733"
            />
          </a>
          <p className="text-sm text-gray-400">Built by Adi</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <SamplePlan />
        <ComparisonBanner />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <SpyCrossSell />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
