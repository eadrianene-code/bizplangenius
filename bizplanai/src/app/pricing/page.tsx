import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/pricing',
  },
  title: 'Pricing - All Products & Subscriptions | BizPlan Genius',
  description: 'BizPlan Genius pricing: free tools, one-time products from $19, bundles from $59, and monthly subscriptions from $9/mo. Everything you need to launch your business.',
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

const ONE_TIME = [
  { name: 'Competitor Spy Report', desc: '10-15 real competitors analyzed with SWOT, pricing, and 90-day roadmap', price: 19, href: '/spy', color: 'text-brand-600' },
  { name: 'Investor Email Templates', desc: '10 personalized fundraising emails with subject lines and tips', price: 19, href: '/investor-emails', color: 'text-indigo-600' },
  { name: 'Business Plan (Starter)', desc: '7-section plan with real competitor data and financial projections', price: 29, href: '/generate?tier=starter', color: 'text-brand-600' },
  { name: 'Social Media Pack', desc: '30 days of posts for Twitter, LinkedIn, Instagram, and Facebook', price: 29, href: '/social-pack', color: 'text-pink-600' },
  { name: 'Logo & Brand Kit', desc: '3 logo concepts, color palette, typography, and brand voice', price: 29, href: '/brand-kit', color: 'text-orange-600' },
  { name: 'Pitch Deck', desc: '12-slide investor deck with speaker notes', price: 39, href: '/pitch-deck', color: 'text-purple-600' },
  { name: 'Business Plan (Pro)', desc: 'Full plan + Operations, Risk Analysis, Money-Back Guarantee', price: 49, href: '/generate?tier=pro', color: 'text-brand-600', popular: true },
  { name: 'Website Builder', desc: 'Custom website generated from your plan. 6 types available.', price: 99, href: '/build-website', color: 'text-accent-600' },
];

const BUNDLES = [
  { name: 'Starter Bundle', items: 'Spy Report + Pro Business Plan', price: 59, savings: 9, href: '/bundles' },
  { name: 'Launch Pack', items: 'Spy + Pro Plan + Website + Pitch Deck', price: 199, savings: 68, href: '/bundles', popular: true },
  { name: 'Full Business Kit', items: 'All 6 core products', price: 349, savings: 25, href: '/bundles' },
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
              Generate My Plan - $29
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600">Free tools to start. One-time products to launch. Subscriptions to grow.</p>
        </div>

        {/* Free Tools */}
        <section className="mb-16">
          <h2 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-4">Free Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FREE_TOOLS.map((tool, i) => (
              <Link key={i} href={tool.href} className="p-5 rounded-xl border-2 border-green-200 bg-green-50/50 hover:border-green-400 transition block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{tool.name}</p>
                    <p className="text-sm text-gray-500">{tool.desc}</p>
                  </div>
                  <span className="text-xl font-extrabold text-green-600">$0</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* One-Time Products */}
        <section className="mb-16">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">One-Time Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ONE_TIME.map((p, i) => (
              <Link key={i} href={p.href} className={`p-5 rounded-xl border hover:shadow-md transition block ${(p as any).popular ? 'border-2 border-brand-300 bg-brand-50/30' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{p.name}</p>
                      {(p as any).popular && <span className="text-[10px] font-bold text-white bg-brand-600 px-2 py-0.5 rounded-full">Popular</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{p.desc}</p>
                  </div>
                  <span className={`text-2xl font-extrabold ${p.color} flex-shrink-0 ml-4`}>${p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bundles */}
        <section className="mb-16">
          <h2 className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-4">Bundles: Save More</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BUNDLES.map((b, i) => (
              <Link key={i} href={b.href} className={`p-6 rounded-xl border-2 hover:shadow-md transition block ${(b as any).popular ? 'border-brand-400 bg-brand-50/50 ring-1 ring-brand-200' : 'border-gray-200'}`}>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-lg">{b.name}</p>
                  <p className="text-sm text-gray-500 mt-1 mb-3">{b.items}</p>
                  <p className="text-3xl font-extrabold text-gray-900">${b.price}</p>
                  <p className="text-sm font-semibold text-green-600 mt-1">Save ${b.savings}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Subscriptions */}
        <section className="mb-16">
          <h2 className="text-sm font-bold text-accent-600 uppercase tracking-wider mb-4">Monthly Subscriptions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUBSCRIPTIONS.map((s, i) => (
              <Link key={i} href={s.href} className="p-6 rounded-xl border-2 border-accent-200 bg-accent-50/30 hover:border-accent-400 transition block">
                <p className="font-bold text-gray-900 text-lg">{s.name}</p>
                <p className="text-sm text-gray-500 mt-1 mb-4">{s.desc}</p>
                <div className="flex items-baseline gap-3">
                  <div>
                    <span className="text-2xl font-extrabold text-accent-600">${s.monthly}</span>
                    <span className="text-sm text-gray-400">/mo</span>
                  </div>
                  <span className="text-gray-300">or</span>
                  <div>
                    <span className="text-2xl font-extrabold text-accent-600">${s.yearly}</span>
                    <span className="text-sm text-gray-400">/mo yearly</span>
                  </div>
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
              { q: 'Are there any hidden fees?', a: 'No. One-time products are a single payment. Subscriptions are clearly priced monthly or yearly. Cancel anytime.' },
              { q: 'Can I upgrade from Starter to Pro?', a: 'Yes. You can purchase the Pro plan at any time to get the additional sections (Operations Plan, Risk Analysis).' },
              { q: 'Do subscriptions auto-renew?', a: 'Yes, but you can cancel anytime through the Stripe billing portal. No cancellation fees.' },
              { q: 'Which bundle should I choose?', a: 'If you want to launch a business, the Launch Pack ($199) has everything you need: research, plan, website, and pitch deck. It saves $68 vs buying separately.' },
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
