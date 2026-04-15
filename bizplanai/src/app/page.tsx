'use client';

import { useState } from 'react';
import SamplePdfGate from './components/SamplePdfGate';
import LiveCounter from './components/LiveCounter';


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

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [freeOpen, setFreeOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
        <nav className="hidden md:flex items-center gap-6">
          {/* Free Tools Dropdown */}
          <div className="relative" onMouseEnter={() => setFreeOpen(true)} onMouseLeave={() => setFreeOpen(false)}>
            <button className="text-sm text-gray-600 hover:text-brand-600 transition flex items-center gap-1">
              Free Tools
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {freeOpen && (
              <div className="absolute top-full left-0 pt-2 w-64">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2">
                  <a href="/free-competitor-check" className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                    <p className="text-sm font-semibold text-gray-900">Competitor Check</p>
                    <p className="text-xs text-gray-500">Find your top 3 competitors</p>
                  </a>
                  <a href="/business-name-generator" className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                    <p className="text-sm font-semibold text-gray-900">Name Generator</p>
                    <p className="text-xs text-gray-500">10 unique business name ideas</p>
                  </a>
                  <a href="/startup-cost-calculator" className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                    <p className="text-sm font-semibold text-gray-900">Cost Calculator</p>
                    <p className="text-xs text-gray-500">Estimate your startup costs</p>
                  </a>
                  <a href="/validate-idea" className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                    <p className="text-sm font-semibold text-gray-900">Idea Validator</p>
                    <p className="text-xs text-gray-500">Score your idea with real data</p>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Products Dropdown */}
          <div className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
            <button className="text-sm text-gray-600 hover:text-brand-600 transition flex items-center gap-1">
              Products
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {productsOpen && (
              <div className="absolute top-full left-0 pt-2 w-72">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2">
                  <a href="/spy" className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-semibold text-gray-900">Competitor Spy Report</p><p className="text-xs text-gray-500">10-15 real competitors analyzed</p></div>
                      <span className="text-xs font-bold text-brand-600">$19</span>
                    </div>
                  </a>
                  <a href="/build-website" className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-semibold text-gray-900">Website Builder</p><p className="text-xs text-gray-500">Custom site from your plan</p></div>
                      <span className="text-xs font-bold text-accent-600">$99</span>
                    </div>
                  </a>
                  <a href="/pitch-deck" className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-semibold text-gray-900">Pitch Deck</p><p className="text-xs text-gray-500">12 investor slides</p></div>
                      <span className="text-xs font-bold text-purple-600">$39</span>
                    </div>
                  </a>
                  <a href="/social-pack" className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-semibold text-gray-900">Social Media Pack</p><p className="text-xs text-gray-500">30 days of content</p></div>
                      <span className="text-xs font-bold text-pink-600">$29</span>
                    </div>
                  </a>
                  <a href="/brand-kit" className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-semibold text-gray-900">Logo & Brand Kit</p><p className="text-xs text-gray-500">Colors, fonts, voice guide</p></div>
                      <span className="text-xs font-bold text-orange-600">$29</span>
                    </div>
                  </a>
                  <a href="/investor-emails" className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-semibold text-gray-900">Investor Emails</p><p className="text-xs text-gray-500">10 fundraising templates</p></div>
                      <span className="text-xs font-bold text-indigo-600">$19</span>
                    </div>
                  </a>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <a href="/bundles" className="block px-3 py-2.5 rounded-lg hover:bg-brand-50 transition">
                      <div className="flex items-center justify-between">
                        <div><p className="text-sm font-semibold text-brand-600">Bundles -- Save up to $68</p><p className="text-xs text-gray-500">Get everything from $59</p></div>
                      </div>
                    </a>
                    <a href="/monitoring" className="block px-3 py-2.5 rounded-lg hover:bg-accent-50 transition">
                      <div className="flex items-center justify-between">
                        <div><p className="text-sm font-semibold text-accent-600">Subscriptions</p><p className="text-xs text-gray-500">Monthly monitoring & social from $9/mo</p></div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <a href="/pricing" className="text-sm text-gray-600 hover:text-brand-600 transition">Pricing</a>
          <a href="/blog" className="text-sm text-gray-600 hover:text-brand-600 transition">Blog</a>
          <a href="/generate" className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition shadow-md shadow-brand-600/20">
            Generate My Plan - $29
          </a>
        </nav>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-1 max-h-[80vh] overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 pt-2">Free Tools</p>
          <a href="/free-competitor-check" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Competitor Check</a>
          <a href="/business-name-generator" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Name Generator</a>
          <a href="/startup-cost-calculator" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Cost Calculator</a>
          <a href="/validate-idea" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Idea Validator</a>
          <div className="border-t border-gray-100 my-2" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Products</p>
          <a href="/spy" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Competitor Spy -- $19</a>
          <a href="/build-website" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Website Builder -- $99</a>
          <a href="/pitch-deck" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Pitch Deck -- $39</a>
          <a href="/social-pack" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Social Pack -- $29</a>
          <a href="/brand-kit" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Brand Kit -- $29</a>
          <a href="/investor-emails" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Investor Emails -- $19</a>
          <a href="/bundles" onClick={() => setMobileOpen(false)} className="block text-brand-600 font-semibold py-2 px-2">Bundles -- Save up to $68</a>
          <a href="/monitoring" onClick={() => setMobileOpen(false)} className="block text-accent-600 font-semibold py-2 px-2">Subscriptions -- from $9/mo</a>
          <div className="border-t border-gray-100 my-2" />
          <a href="/pricing" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Pricing</a>
          <a href="/blog" onClick={() => setMobileOpen(false)} className="block text-gray-600 hover:text-brand-600 py-2 px-2">Blog</a>
          <a href="/generate" className="block w-full text-center px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-lg mt-3">
            Generate My Plan - $29
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
          Go from idea to launch with AI
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Your Business Plan.{' '}
          <span className="text-gradient">Real Data. Ready in 8 Minutes.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
          Describe your idea. Our AI researches your real competitors, builds an investor-ready
          plan, generates your website, pitch deck, and brand -- everything you need to launch.
        </p>

        {/* Idea to Launch Steps */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-8 text-sm">
          <span className="px-3 py-1.5 bg-green-50 text-green-700 font-semibold rounded-full border border-green-200">Idea</span>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="px-3 py-1.5 bg-brand-50 text-brand-700 font-semibold rounded-full border border-brand-200">Research</span>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="px-3 py-1.5 bg-brand-50 text-brand-700 font-semibold rounded-full border border-brand-200">Plan</span>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="px-3 py-1.5 bg-accent-50 text-accent-700 font-semibold rounded-full border border-accent-200">Website</span>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="px-3 py-1.5 bg-purple-50 text-purple-700 font-semibold rounded-full border border-purple-200">Pitch</span>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="px-3 py-1.5 bg-orange-50 text-orange-700 font-semibold rounded-full border border-orange-200">Launch</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/generate" className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg">
            Generate My Business Plan - $29
          </a>
          <a href="/free-competitor-check" className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-brand-300 hover:text-brand-600 transition text-lg">
            Try Free Competitor Check
          </a>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          One-time payment. No subscription. 100% money-back guarantee.
        </div>
        <div className="mt-3 flex items-center justify-center gap-4 text-sm font-medium">
          <SamplePdfGate pdfUrl="/sample-business-plan.pdf" label="Sample Business Plan" className="text-brand-600 underline hover:text-brand-700">
            See a real sample plan
          </SamplePdfGate>
          <span className="text-gray-300">|</span>
          <a href="/bundles" className="text-brand-600 underline hover:text-brand-700">
            Save with bundles
          </a>
          <span className="text-gray-300">|</span>
          <a href="/compare" className="text-brand-600 underline hover:text-brand-700">
            Compare us
          </a>
        </div>
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
            <SamplePdfGate
              pdfUrl="/sample-business-plan.pdf"
              label="Sample Business Plan"
              className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition shadow-md shadow-brand-600/20 inline-block cursor-pointer"
            >
              View Sample Plan (PDF)
            </SamplePdfGate>
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

function MoreTools() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Go From Idea to Launch</h2>
          <p className="text-gray-600">Everything you need to start your business, powered by AI</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <a href="/free-competitor-check" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition block">
            <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Free</p>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Competitor Check</h3>
            <p className="text-xs text-gray-500 mb-2">Find top 3 competitors</p>
            <p className="text-lg font-extrabold text-green-600">$0</p>
          </a>
          <a href="/spy" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition block">
            <p className="text-[10px] font-bold text-brand-600 uppercase mb-1">Research</p>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Competitor Spy</h3>
            <p className="text-xs text-gray-500 mb-2">10-15 competitors analyzed</p>
            <p className="text-lg font-extrabold text-brand-600">$19</p>
          </a>
          <a href="/generate" className="bg-white rounded-xl border-2 border-brand-200 p-4 hover:shadow-md transition block bg-brand-50/30">
            <p className="text-[10px] font-bold text-brand-600 uppercase mb-1">Plan</p>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Business Plan</h3>
            <p className="text-xs text-gray-500 mb-2">Investor-ready with real data</p>
            <p className="text-lg font-extrabold text-brand-600">$29</p>
          </a>
          <a href="/build-website" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition block">
            <p className="text-[10px] font-bold text-accent-600 uppercase mb-1">Build</p>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Website</h3>
            <p className="text-xs text-gray-500 mb-2">Custom site from plan</p>
            <p className="text-lg font-extrabold text-accent-600">$99</p>
          </a>
          <a href="/pitch-deck" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition block">
            <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">Fundraise</p>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Pitch Deck</h3>
            <p className="text-xs text-gray-500 mb-2">12 investor slides</p>
            <p className="text-lg font-extrabold text-purple-600">$39</p>
          </a>
          <a href="/investor-emails" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition block">
            <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">Outreach</p>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Investor Emails</h3>
            <p className="text-xs text-gray-500 mb-2">10 fundraising templates</p>
            <p className="text-lg font-extrabold text-indigo-600">$19</p>
          </a>
          <a href="/social-pack" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition block">
            <p className="text-[10px] font-bold text-pink-600 uppercase mb-1">Grow</p>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Social Pack</h3>
            <p className="text-xs text-gray-500 mb-2">30 days of posts</p>
            <p className="text-lg font-extrabold text-pink-600">$29</p>
          </a>
          <a href="/brand-kit" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition block">
            <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">Brand</p>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Brand Kit</h3>
            <p className="text-xs text-gray-500 mb-2">Logo, colors, voice</p>
            <p className="text-lg font-extrabold text-orange-600">$29</p>
          </a>
        </div>
        <div className="text-center mt-6">
          <a href="/bundles" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25">
            Save with bundles -- from $59
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
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

function NewsletterForm({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: typeof window !== 'undefined' ? window.location.pathname : 'unknown' }),
      });
      if (res.ok) { setStatus('done'); setEmail(''); }
      else { setStatus('error'); }
    } catch { setStatus('error'); }
  };
  const inputBase = 'flex-1 px-3 py-2 rounded-lg text-sm outline-none border';
  const inputClass = theme === 'dark'
    ? `${inputBase} bg-gray-800 text-white border-gray-700 focus:border-brand-400 placeholder-gray-500`
    : `${inputBase} bg-white text-gray-900 border-gray-200 focus:border-brand-400 placeholder-gray-400`;
  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <p className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Get founder tactics by email</p>
      <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Competitor research and business plan playbooks. No fluff, unsubscribe anytime.</p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          disabled={status === 'loading' || status === 'done'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'done'}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition disabled:opacity-60"
        >
          {status === 'loading' ? '...' : status === 'done' ? 'Got it!' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && <p className="text-xs text-red-500 mt-2">Something went wrong. Try again.</p>}
      {status === 'done' && <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Subscribed. Check your inbox soon.</p>}
    </form>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-gray-100 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex justify-center">
          <NewsletterForm theme="light" />
        </div>
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
              <a href="/build-website" className="block text-sm text-gray-500 hover:text-gray-700">Website Builder</a>
              <a href="/pitch-deck" className="block text-sm text-gray-500 hover:text-gray-700">Pitch Deck Generator</a>
              <a href="/social-pack" className="block text-sm text-gray-500 hover:text-gray-700">Social Media Pack</a>
              <a href="/brand-kit" className="block text-sm text-gray-500 hover:text-gray-700">Logo & Brand Kit</a>
              <a href="/investor-emails" className="block text-sm text-gray-500 hover:text-gray-700">Investor Emails</a>
              <a href="/bundles" className="block text-sm text-gray-500 hover:text-gray-700">Bundles</a>
              <a href="/monitoring" className="block text-sm text-gray-500 hover:text-gray-700">Subscriptions</a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-3">Free Tools</p>
            <div className="space-y-2">
              <a href="/free-competitor-check" className="block text-sm text-gray-500 hover:text-gray-700">Free Competitor Check</a>
              <a href="/business-name-generator" className="block text-sm text-gray-500 hover:text-gray-700">Free Name Generator</a>
              <a href="/startup-cost-calculator" className="block text-sm text-gray-500 hover:text-gray-700">Free Cost Calculator</a>
              <a href="/validate-idea" className="block text-sm text-gray-500 hover:text-gray-700">Free Idea Validator</a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-3">Company</p>
            <div className="space-y-2">
              <a href="/about" className="block text-sm text-gray-500 hover:text-gray-700">About</a>
              <a href="/methodology" className="block text-sm text-gray-500 hover:text-gray-700">Methodology</a>
              <a href="/blog" className="block text-sm text-gray-500 hover:text-gray-700">Blog</a>
              <a href="/compare" className="block text-sm text-gray-500 hover:text-gray-700">Compare</a>
              <a href="/refer" className="block text-sm text-gray-500 hover:text-gray-700">Refer & Earn</a>
              <a href="/affiliates" className="block text-sm text-gray-500 hover:text-gray-700">Affiliate Program</a>
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
        <LiveCounter />
        <TrustBar />
        <SamplePlan />
        <ComparisonBanner />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <SpyCrossSell />
        <MoreTools />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
