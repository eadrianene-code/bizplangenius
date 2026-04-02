'use client';

import { useState } from 'react';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

const FEATURES = [
  {
    icon: '🔍',
    title: 'Real Competitor Research',
    desc: 'We analyze your actual competitors — their pricing, positioning, strengths, and weaknesses. No generic filler.',
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
    a: 'We offer one free revision. If you\'re still not happy, we\'ll refund your purchase — no questions asked.',
  },
  {
    q: 'Do you store my business idea?',
    a: 'We take privacy seriously. Your business details are used only to generate your plan and are not shared with anyone or used for any other purpose.',
  },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
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
          Trusted by 1,000+ entrepreneurs
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Business Plans with{' '}
          <span className="text-gradient">Real Market Research</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Describe your business idea. Our AI researches your actual competitors,
          analyzes real market data, and generates an investor-ready business plan
          in minutes — not weeks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#pricing" className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg">
            Generate My Business Plan — $49
          </a>
          <a href="#how-it-works" className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-brand-300 hover:text-brand-600 transition text-lg">
            See How It Works
          </a>
        </div>
        <p className="mt-4 text-sm text-gray-500">One-time payment. No subscription. Money-back guarantee.</p>
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
            <p className="text-3xl font-bold text-red-500 line-through">$2,000–$10,000</p>
            <p className="text-gray-500 mt-1">Business plan consultant</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-500 line-through">40+ hours</p>
            <p className="text-gray-500 mt-1">DIY with templates</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent-500">$49 · 10 min</p>
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

function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get Your Business Plan</h2>
          <p className="text-lg text-gray-600">One plan. One price. No hidden fees.</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-brand-600 p-8 shadow-xl shadow-brand-600/10">
          <div className="text-center">
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">Complete Business Plan</p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-5xl font-extrabold">$49</span>
              <span className="text-gray-500 line-through text-lg">$149</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">One-time payment · No subscription</p>
          </div>
          <ul className="space-y-3 mb-8">
            {[
              'Executive Summary',
              'Real Competitor Analysis (5-10 competitors)',
              'Market Size & Growth Data',
              'Target Customer Profile',
              '3-Year Financial Projections',
              'Marketing & Sales Strategy',
              'Operations Plan',
              'Risk Analysis & Mitigation',
              'Professional PDF Download',
              '1 Free Revision',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="/generate"
            className="block w-full text-center px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg"
          >
            Generate My Business Plan
          </a>
          <p className="text-center text-sm text-gray-500 mt-3">
            100% money-back guarantee if not satisfied
          </p>
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

function CTA() {
  return (
    <section className="py-20 px-4 bg-brand-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Stop Writing Business Plans the Hard Way
        </h2>
        <p className="text-lg text-brand-100 mb-8 max-w-xl mx-auto">
          Join thousands of entrepreneurs who launched faster with AI-powered business plans
          backed by real market research.
        </p>
        <a href="/generate" className="inline-block px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-lg text-lg">
          Generate My Business Plan — $49
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} BizPlan Genius. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
          <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
          <a href="mailto:support@bizplangenius.com" className="text-sm text-gray-500 hover:text-gray-700">Contact</a>
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
        <ComparisonBanner />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
