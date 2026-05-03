import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/pricing',
  },
  title: 'Pricing - All Products & Subscriptions | BizPlan Genius',
  description: 'BizPlan Genius pricing: free tools, one-time products from $97, bundles from $197, and monthly subscriptions from $9/mo. Everything you need to launch your business.',
  openGraph: {
    title: 'Pricing - BizPlan Genius',
    description: 'See all products, bundles, and subscription plans. Free tools, one-time purchases, and monthly plans.',
    url: 'https://www.bizplangenius.com/pricing',
    siteName: 'BizPlan Genius',
  },
};

const FREE_TOOLS = [
  { name: 'Competitor Check', desc: 'Find your top 3 competitors', href: '/free-competitor-check' },
  { name: 'Name Generator', desc: '10 unique business name ideas', href: '/business-name-generator' },
  { name: 'Cost Calculator', desc: 'Estimate your startup costs', href: '/startup-cost-calculator' },
];

const SIDECAR_TIERS = [
  {
    name: 'Spy Report',
    tagline: 'I just want my competitors',
    price: 97,
    href: '/spy',
    bullets: ['10-15 real competitors with SWOT', 'Pricing comparison + vulnerability audit', '90-day tactical roadmap', 'PDF in under 5 minutes'],
    color: 'border-gray-200',
    accent: 'text-brand-600',
  },
  {
    name: 'Business Plan Pro',
    tagline: 'I just want the plan',
    price: 147,
    href: '/generate?tier=pro',
    bullets: ['9-section investor-ready PDF', '3-year financial projections', 'Operations + risk analysis', '100% money-back guarantee'],
    color: 'border-gray-200',
    accent: 'text-brand-600',
  },
];

const FULL_KIT = {
  name: 'Full Business Kit',
  tagline: 'Everything to launch your business',
  price: 397,
  originalPrice: 440,
  savings: 43,
  href: '/bundles',
  // Real product breakdown matching /api/bundle-checkout
  lineItems: [
    { name: 'Competitor Spy Report', solo: 97 },
    { name: 'Business Plan Pro', solo: 147 },
    { name: 'Website Builder', solo: 99 },
    { name: 'Pitch Deck', solo: 39 },
    { name: 'Logo & Brand Kit', solo: 29 },
    { name: '30-Day Social Pack', solo: 29 },
  ],
};

const ADD_ONS = [
  { name: 'Starter Plan', price: 97, href: '/generate?tier=starter', desc: '7-section plan' },
  { name: 'Pitch Deck', price: 39, href: '/pitch-deck', desc: '12 investor slides' },
  { name: 'Investor Emails', price: 19, href: '/investor-emails', desc: '10 cold-outreach templates' },
  { name: 'Logo & Brand Kit', price: 29, href: '/brand-kit', desc: 'Logo, colors, voice' },
  { name: 'Social Media Pack', price: 29, href: '/social-pack', desc: '30 days of posts' },
  { name: 'Ad Copy Generator', price: 19, href: '/ad-copy', desc: '15 ad variations' },
  { name: 'Legal Pages', price: 19, href: '/legal-pages', desc: 'Terms + Privacy + Cookies' },
  { name: 'Website Builder', price: 99, href: '/build-website', desc: '6 types available' },
];

const SUBSCRIPTIONS = [
  { name: 'Competitor Monitoring', desc: 'Updated spy report every 30 days + competitor alerts', monthly: 15, yearly: 9, href: '/monitoring' },
  { name: 'Monthly Social Pack', desc: '30 new posts delivered every month', monthly: 19, yearly: 12, href: '/monitoring' },
  { name: 'Website Hosting', desc: 'Your AI-generated website, hosted live with custom domain and SSL', monthly: 19, yearly: 12, href: '/monitoring' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">BizPlan Genius</Link>
          <nav className="flex gap-4 items-center">
            <Link href="/free-competitor-check" className="text-sm text-gray-600 hover:text-gray-900">Free Tool</Link>
            <Link href="/generate" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Generate My Plan - $97
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Real Research. Real Plan. Real Website.</h1>
          <p className="text-lg text-gray-600">One bundle replaces a $5,000 consulting engagement.</p>
        </div>

        {/* Real comparison anchor: consultants vs DIY vs us */}
        <section className="mb-12 max-w-3xl mx-auto">
          <div className="rounded-2xl border-2 border-gray-100 bg-gray-50/50 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-red-500 line-through decoration-2">$2,000-$10,000</p>
                <p className="text-sm text-gray-500 mt-1">Business plan consultant</p>
                <p className="text-xs text-gray-400 mt-1">2 to 6 weeks</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-red-500 line-through decoration-2">40+ hours</p>
                <p className="text-sm text-gray-500 mt-1">DIY with templates</p>
                <p className="text-xs text-gray-400 mt-1">Hallucinated competitor data</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-accent-600">From $97</p>
                <p className="text-sm text-gray-700 font-semibold mt-1">BizPlan Genius</p>
                <p className="text-xs text-gray-500 mt-1">10 min, real data, PDF in inbox</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hero: Full Kit center, Starter/Pro Sidecars */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* LEFT sidecar */}
            <Link
              href={SIDECAR_TIERS[0].href}
              className={`lg:col-span-3 p-6 rounded-2xl border-2 ${SIDECAR_TIERS[0].color} hover:border-gray-300 hover:shadow-md transition flex flex-col`}
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{SIDECAR_TIERS[0].tagline}</p>
              <p className="font-bold text-gray-900 text-xl mb-1">{SIDECAR_TIERS[0].name}</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-3xl font-extrabold ${SIDECAR_TIERS[0].accent}`}>${SIDECAR_TIERS[0].price}</span>
                <span className="text-xs text-gray-400">one-time</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 mb-6 flex-1">
                {SIDECAR_TIERS[0].bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-500 mt-0.5">&#10003;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <span className="text-sm font-semibold text-brand-600 hover:underline">Get Spy Report &rarr;</span>
            </Link>

            {/* CENTER: Full Business Kit hero */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1 bg-brand-600 text-white text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap">
                Most Popular - Save ${FULL_KIT.savings}
              </div>
              <div className="p-7 sm:p-8 rounded-2xl border-2 border-brand-500 bg-gradient-to-br from-brand-50 to-white shadow-xl shadow-brand-500/10 ring-2 ring-brand-100 h-full flex flex-col">
                <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 text-center">{FULL_KIT.tagline}</p>
                <h2 className="font-extrabold text-gray-900 text-2xl sm:text-3xl text-center mb-3">{FULL_KIT.name}</h2>

                <div className="text-center mb-5">
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-5xl sm:text-6xl font-extrabold text-brand-700">${FULL_KIT.price}</span>
                    <span className="text-2xl text-gray-400 line-through decoration-2">${FULL_KIT.originalPrice}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">one-time, no subscription</p>
                </div>

                {/* Bundle math callout: itemized */}
                <div className="rounded-lg bg-white border border-brand-100 p-4 mb-5">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Whats inside (real math)</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {FULL_KIT.lineItems.map((item, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span>{item.name}</span>
                        <span className="text-gray-500 font-mono">${item.solo}</span>
                      </li>
                    ))}
                    <li className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
                      <span className="font-semibold text-gray-900">Bought separately</span>
                      <span className="font-mono text-gray-500 line-through">${FULL_KIT.originalPrice}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-bold text-brand-700">Bundle price</span>
                      <span className="font-bold text-brand-700 font-mono">${FULL_KIT.price}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-700">You save</span>
                      <span className="font-bold text-green-700 font-mono">${FULL_KIT.savings} (10%)</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href={FULL_KIT.href}
                  className="block w-full text-center px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-base sm:text-lg"
                >
                  Get the Full Kit - ${FULL_KIT.price}
                </Link>
                <p className="text-center text-xs text-gray-500 mt-3">100% money-back guarantee on the Pro Plan inside</p>
              </div>
            </div>

            {/* RIGHT sidecar */}
            <Link
              href={SIDECAR_TIERS[1].href}
              className={`lg:col-span-3 p-6 rounded-2xl border-2 ${SIDECAR_TIERS[1].color} hover:border-gray-300 hover:shadow-md transition flex flex-col`}
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{SIDECAR_TIERS[1].tagline}</p>
              <p className="font-bold text-gray-900 text-xl mb-1">{SIDECAR_TIERS[1].name}</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-3xl font-extrabold ${SIDECAR_TIERS[1].accent}`}>${SIDECAR_TIERS[1].price}</span>
                <span className="text-xs text-gray-400">one-time</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 mb-6 flex-1">
                {SIDECAR_TIERS[1].bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-500 mt-0.5">&#10003;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <span className="text-sm font-semibold text-brand-600 hover:underline">Get Pro Plan &rarr;</span>
            </Link>
          </div>

          <div className="text-center mt-6">
            <Link href="/bundles" className="text-sm text-gray-500 hover:text-brand-600 underline">
              See the in-between Launch Pack ($297) and Starter Bundle ($197) &rarr;
            </Link>
          </div>
        </section>

        {/* Add-ons (collapsed - smaller products for already-in-funnel users) */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Standalone Add-Ons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ADD_ONS.map((p, i) => (
              <Link key={i} href={p.href} className="p-4 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-sm transition block bg-white">
                <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 mb-2">{p.desc}</p>
                <p className="text-lg font-extrabold text-gray-900">${p.price}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Free Tools */}
        <section className="mb-16">
          <h2 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-4 text-center">Free Tools (No Email Required)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FREE_TOOLS.map((tool, i) => (
              <Link key={i} href={tool.href} className="p-4 rounded-xl border-2 border-green-200 bg-green-50/50 hover:border-green-400 transition block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{tool.name}</p>
                    <p className="text-xs text-gray-500">{tool.desc}</p>
                  </div>
                  <span className="text-lg font-extrabold text-green-600">$0</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Subscriptions (lowest priority - bottom) */}
        <section className="mb-16">
          <h2 className="text-sm font-bold text-accent-600 uppercase tracking-wider mb-4 text-center">Optional Monthly Subscriptions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SUBSCRIPTIONS.map((s, i) => (
              <Link key={i} href={s.href} className="p-5 rounded-xl border border-accent-200 bg-accent-50/30 hover:border-accent-400 transition block">
                <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                <p className="text-xs text-gray-500 mt-1 mb-3">{s.desc}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-accent-600">${s.monthly}</span>
                  <span className="text-xs text-gray-400">/mo</span>
                  <span className="text-xs text-gray-300">or</span>
                  <span className="text-xl font-extrabold text-accent-600">${s.yearly}</span>
                  <span className="text-xs text-gray-400">/mo yearly</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Why is the Full Kit only 10% off and not bigger?', a: 'Because the math is real. Bundles in our space typically anchor against inflated "original prices" that no one pays. We price the bundle so each item is actually cheaper than buying it solo, and we show you the line items so you can verify it.' },
              { q: 'Are there any hidden fees?', a: 'No. One-time products are a single payment. Subscriptions are clearly priced monthly or yearly. Cancel anytime through Stripes billing portal.' },
              { q: 'Can I upgrade from Starter to Pro?', a: 'Yes. Buy the Pro plan at any time to add the Operations Plan, Risk Analysis, and money-back guarantee.' },
              { q: 'Which bundle should I pick?', a: 'If you only need research and a plan, the Starter Bundle ($197) is enough. If you also need a website and pitch deck, Launch Pack ($297). If you want everything to launch a complete business including brand and social content, the Full Kit ($397) saves $43 versus separate.' },
            ].map((faq, i) => (
              <div key={i} className="border rounded-xl p-5">
                <p className="font-semibold text-gray-900 mb-2">{faq.q}</p>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
