// Server component. Renders the full marketing / SEO-optimized content
// for cold visitors to /build-website. This is what Googlebot sees and indexes.
// When a user arrives with ?plan_session_id= or ?session_id=, page.tsx
// routes them to the ClientApp instead.

import { WEBSITE_TYPES } from './data';

const EVERY_WEBSITE_INCLUDES = [
  { title: 'Copy from your plan', desc: 'Headline, value prop, and about page use your business plan as source of truth' },
  { title: 'Pricing from your plan', desc: 'Pricing page matches the financial projections in your plan' },
  { title: 'Multi-page', desc: 'Add About, Services, Contact, and more' },
  { title: 'Fully editable', desc: 'Change text, prices, sections, anything, anytime' },
  { title: 'Responsive', desc: 'Looks great on desktop, tablet, and mobile' },
  { title: 'Source code', desc: 'Download HTML/CSS and host anywhere' },
  { title: 'SEO ready', desc: 'Meta tags, titles, and descriptions included' },
  { title: '6 color schemes', desc: 'Match your brand in one click' },
];

const FAQS = [
  {
    q: 'How is this different from Wix, Squarespace, or Durable?',
    a: 'Every other website builder starts from a blank template or a one-line prompt. BizPlan Genius starts from your full business plan. Your homepage headline comes from your value proposition. Your pricing page matches your financial projections. Your about page sounds like the founder story you wrote in Chapter 1. Because the plan is the source of truth, the output is coherent end-to-end. No re-entry. No hiring a copywriter.',
  },
  {
    q: 'What website types can I generate?',
    a: 'Six types: Landing Page ($99), E-commerce Store ($149), Booking / Services ($129), Restaurant / Food ($129), Portfolio / Agency ($99), and SaaS / Tech Product ($199). Each is tailored for the specific industry layout, calls to action, and sections that work best for that business type.',
  },
  {
    q: 'Do I need a business plan first?',
    a: 'Yes. The website builder uses your plan data to generate copy, pricing, and positioning that match your brand. You can generate a Business Plan starting at $97, or go straight to the Launch Pack ($297) which bundles the plan and website together.',
  },
  {
    q: 'Can I edit the website after it is generated?',
    a: 'Yes. You get a full editor for copy, sections, colors, and structure. You can also download the HTML/CSS source code and host anywhere you want.',
  },
  {
    q: 'How long does it take?',
    a: 'The plan generates in 3 to 8 minutes. The website generates in about 60 seconds once the plan is ready. End to end, most people go from idea to live website in under an hour.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. Point your domain at the generated site, or download the source code and host it wherever. Optional Website Hosting is available at $19/mo ($12/mo yearly) for managed hosting with SSL.',
  },
];

export default function ShowcaseContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header (server-rendered) */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <nav className="hidden md:flex items-center gap-5">
            <a href="/products" className="text-sm text-gray-600 hover:text-brand-600 transition font-medium">Products</a>
            <a href="/pricing" className="text-sm text-gray-600 hover:text-brand-600 transition">Pricing</a>
            <a href="/blog" className="text-sm text-gray-600 hover:text-brand-600 transition">Blog</a>
            <a href="/generate" className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition shadow-sm">
              Get Started
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-16 pb-12 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-accent-50 text-accent-700 text-sm font-medium rounded-full mb-6 border border-accent-200">
              The only AI website builder built from your business plan
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
              Your business plan just built{' '}
              <span className="text-gradient">your website.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              The only AI platform that turns your full business plan into your actual live website in one flow.
              Homepage copy, pricing page, and about page, all built from your plan data. No re-entry. No copywriter. No Squarespace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <a href="/generate" className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg">
                Generate My Business Plan - $97
              </a>
              <a href="/bundles" className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-brand-300 hover:text-brand-600 transition text-lg">
                Plan + Website Bundle - $297
              </a>
            </div>
            <p className="text-sm text-gray-500">One hour. One flow. One brand. From idea to launched website.</p>
          </div>
        </section>

        {/* Why different section */}
        <section className="py-16 px-4 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Every other tool makes you start over twice.</h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Most founders bounce between three or four tools to go from idea to a live business. A plan generator. A website builder. ChatGPT. A designer. Every handoff is a place your brand gets diluted.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <p className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-2">The old way</p>
                <p className="font-bold text-gray-900 mb-2">2-4 weeks, 3-5 tools</p>
                <p className="text-sm text-gray-600">Write plan. Re-enter everything into a website builder. Rewrite copy. Hire a designer. Hope nothing contradicts anything else.</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
                <p className="text-sm font-semibold text-yellow-700 uppercase tracking-wider mb-2">Hiring a freelancer</p>
                <p className="font-bold text-gray-900 mb-2">$500 to $2,000, still re-enter</p>
                <p className="text-sm text-gray-600">They still need a brief. You still write it. The freelancer still interprets. The output still drifts from the plan.</p>
              </div>
              <div className="bg-brand-50 border-2 border-brand-200 rounded-2xl p-6">
                <p className="text-sm font-semibold text-brand-700 uppercase tracking-wider mb-2">BizPlan Genius</p>
                <p className="font-bold text-gray-900 mb-2">Under 1 hour, one tool</p>
                <p className="text-sm text-gray-600">Plan becomes website automatically. Same source of truth, two outputs. Coherent, editable, live.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Website types grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Six website types, tailored by industry</h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Each type is designed around the specific sections, calls to action, and layout that convert for that kind of business.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WEBSITE_TYPES.map(type => (
                <div key={type.key} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{type.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{type.label}</h3>
                      <p className="text-xs text-gray-500">{type.desc}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {type.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 mb-3">Best for: {type.bestFor}</p>
                  <p className="text-xl font-extrabold text-brand-600">${type.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Every website includes */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Every website includes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {EVERY_WEBSITE_INCLUDES.map((f, i) => (
                <div key={i} className="text-center">
                  <p className="font-bold text-gray-900 mb-1">{f.title}</p>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Common Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                  <p className="font-semibold text-gray-900 mb-2">{faq.q}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-brand-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stop starting over.</h2>
            <p className="text-lg text-brand-50 mb-8">One flow. Plan to live website. $297 gets you both.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/bundles" className="px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-lg text-lg">
                Get the Launch Pack - $297
              </a>
              <a href="/generate" className="px-8 py-4 border-2 border-brand-300 text-white font-semibold rounded-xl hover:bg-brand-700 transition text-lg">
                Start With Just the Plan - $97
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FAQ JSON-LD for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map(faq => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
