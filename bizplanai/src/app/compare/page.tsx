import Link from 'next/link';

const COMPETITORS = [
  {
    name: 'BizPlan Genius',
    highlight: true,
    price: 'From $29',
    time: '3-8 minutes',
    data: 'Real (live web search)',
    competitors: '5-15 real competitors',
    financial: 'Real industry benchmarks',
    customization: 'Fully custom to your business',
    extras: 'Website builder, pitch deck, brand kit, social pack',
    support: 'Email + money-back guarantee',
    best: 'Best for founders who want real data, fast, at a fraction of the cost',
  },
  {
    name: 'ChatGPT / Claude',
    price: 'Free - $20/mo',
    time: '10-30 minutes (manual prompting)',
    data: 'Hallucinated / generic',
    competitors: 'Made-up or outdated names',
    financial: 'Generic estimates, no real benchmarks',
    customization: 'Depends on your prompting skill',
    extras: 'None',
    support: 'None',
    best: 'Best for brainstorming, not for investor-ready plans',
  },
  {
    name: 'LivePlan',
    price: '$20-$40/month (subscription)',
    time: 'Days to weeks (manual)',
    data: 'Industry averages (not competitor-specific)',
    competitors: 'You research manually',
    financial: 'Templates you fill in yourself',
    customization: 'Template-based',
    extras: 'Financial dashboard',
    support: 'Email + phone',
    best: 'Best for people who want to write their own plan with a template',
  },
  {
    name: 'Enloop',
    price: '$20-$40/month',
    time: 'Days (manual input)',
    data: 'Industry averages',
    competitors: 'You research manually',
    financial: 'Auto-generated from your inputs',
    customization: 'Template-based',
    extras: 'Performance scoring',
    support: 'Email',
    best: 'Best for financial-heavy plans if you have the data already',
  },
  {
    name: 'Hiring a Consultant',
    price: '$2,000-$10,000+',
    time: '2-6 weeks',
    data: 'Real (if they do the research)',
    competitors: 'Depends on consultant',
    financial: 'Custom (if experienced)',
    customization: 'Fully custom',
    extras: 'Strategy advice',
    support: 'Direct access',
    best: 'Best for funded startups with budget and time',
  },
];

const ROWS = [
  { key: 'price', label: 'Price' },
  { key: 'time', label: 'Time to complete' },
  { key: 'data', label: 'Data quality' },
  { key: 'competitors', label: 'Competitor research' },
  { key: 'financial', label: 'Financial projections' },
  { key: 'customization', label: 'Customization' },
  { key: 'extras', label: 'Extra tools' },
  { key: 'support', label: 'Support' },
] as const;

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">BizPlan Genius</Link>
          <nav className="flex gap-4 items-center">
            <Link href="/free-competitor-check" className="text-sm text-gray-600 hover:text-gray-900">Free Tool</Link>
            <Link href="/generate" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Get Your Plan - $29
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How Does BizPlan Genius Compare?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            An honest comparison. We'll show you where we win and where other options might be better for you.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto mb-16">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-sm font-bold text-gray-500 uppercase tracking-wider border-b-2 min-w-[140px]">Feature</th>
                {COMPETITORS.map((c, i) => (
                  <th key={i} className={`px-4 py-3 text-sm font-bold border-b-2 min-w-[180px] ${c.highlight ? 'text-brand-600 bg-brand-50 border-brand-200' : 'text-gray-900 border-gray-200'}`}>
                    {c.name}
                    {c.highlight && <span className="block text-[10px] text-brand-500 font-medium mt-0.5">Recommended</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={row.key} className={ri % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">{row.label}</td>
                  {COMPETITORS.map((c, ci) => (
                    <td key={ci} className={`px-4 py-3 text-sm border-b ${c.highlight ? 'bg-brand-50/50 text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {(c as any)[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-100">
                <td className="px-4 py-3 text-sm font-bold text-gray-700 border-b">Best for</td>
                {COMPETITORS.map((c, ci) => (
                  <td key={ci} className={`px-4 py-3 text-sm font-medium border-b ${c.highlight ? 'bg-brand-50 text-brand-700' : 'text-gray-700'}`}>
                    {c.best}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Key Differentiators */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why founders choose BizPlan Genius</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="font-bold text-green-900 mb-2">Real data, not hallucinations</h3>
              <p className="text-sm text-green-800">Our AI uses Google Search grounding to find real competitors, real pricing, and real market data. ChatGPT makes it up.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">Minutes, not weeks</h3>
              <p className="text-sm text-blue-800">Get your investor-ready plan in 3-8 minutes. Consultants take 2-6 weeks and cost 40-200x more.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <h3 className="font-bold text-purple-900 mb-2">Full launch toolkit</h3>
              <p className="text-sm text-purple-800">Not just a plan. Get a website, pitch deck, brand kit, social media pack, and investor emails all from one business description.</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
              <h3 className="font-bold text-amber-900 mb-2">One-time payment</h3>
              <p className="text-sm text-amber-800">No subscriptions. Pay once, keep everything forever. LivePlan and others charge monthly even after you're done.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-brand-50 rounded-2xl p-8 sm:p-12 border border-brand-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to try it yourself?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">Start with our free competitor check. No payment required. See the quality of our AI before you commit.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/free-competitor-check" className="px-8 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-600/25">
              Free Competitor Check
            </Link>
            <Link href="/bundles" className="px-8 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition">
              See Bundle Pricing
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
