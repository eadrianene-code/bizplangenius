import Link from 'next/link';

export default function SbaLoanBusinessPlanPage() {
  const sections = [
    'Executive Summary structured to lender review standards',
    'Company Description with ownership, structure, and management profile',
    'Market and Industry Analysis with real competitor research (Gemini + live web search)',
    '3 to 5-Year Financial Projections: income statement, cash flow, balance sheet',
    'Use of Funds breakdown matched to the loan request',
    'Debt Service Coverage Ratio context (lender expectation)',
    'Marketing and Sales Strategy with go-to-market detail',
    'Operations Plan with location, suppliers, and milestones',
    'Risk Analysis and Mitigation Strategies',
    'Professional PDF (30-50 pages, lender-friendly format)',
  ];

  const stats = [
    { value: '$147', label: 'One-time price' },
    { value: '10 min', label: 'Delivery time' },
    { value: '5 yr', label: 'Financial projections' },
  ];

  const faqs = [
    {
      q: 'Will my SBA lender accept this business plan?',
      a: 'Our plan follows the structure that SBA lenders expect: executive summary, market analysis, management and operations, marketing strategy, and 3 to 5-year financial projections including income statement, cash flow, and balance sheet. Loan approval depends on your credit, collateral, business viability, and the lender, not on the plan format alone. We provide the plan; we do not place loans.',
    },
    {
      q: 'Does this cover SBA 7(a), 504, and microloans?',
      a: 'Yes. The Pro plan covers requirements typical lenders ask for under SBA 7(a), 504, and microloan programs. It includes a use of funds section and a debt service coverage context section your loan officer will look for.',
    },
    {
      q: 'How long is the plan?',
      a: 'Typically 30 to 50 pages including financials. SBA lenders generally prefer concise, well-structured plans over 100-page documents that nobody reads.',
    },
    {
      q: 'I am applying for a $250,000 SBA 7(a). Is this enough?',
      a: 'Yes for the plan portion. SBA loan packages also typically require: personal financial statement (SBA Form 413), tax returns, debt schedule, and a copy of your lease or LOI for the location. We provide the plan; your lender or banker will provide forms.',
    },
    {
      q: 'I am buying an existing business with an SBA loan. Will this work?',
      a: 'Yes. The Pro plan supports both startup and acquisition narratives. You enter the seller details and historical financials, and the plan includes them in the projections.',
    },
    {
      q: 'How is this different from a $1,500 to $3,000 SBA plan writer?',
      a: 'Specialty SBA plan writers charge $1,500 to $3,000 and take one to three weeks. We deliver a professionally structured plan in under 10 minutes for $147. For complex multi-property real estate or franchise stack deals, a specialist may still help. For most standalone small business loans, our plan is enough.',
    },
    {
      q: 'What if my lender does not accept the plan?',
      a: 'Pro plan includes a 100% money-back guarantee. If your loan officer returns the plan as inadequate, request a refund within 14 days.',
    },
    {
      q: 'I am a first-time business owner. Is this the right plan for me?',
      a: 'Yes. Most of our customers are first-time owners applying for their first SBA loan. The plan is structured so a non-finance person can fill in the inputs and the AI handles the structure and financials.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">BizPlan Genius</Link>
          <Link href="/generate?tier=pro&purpose=sba" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Get My SBA Plan - $147
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full mb-6 border border-green-100">
            For SBA 7(a), 504, and microloan applicants
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            SBA Loan Business Plan in 10 Minutes
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-3">
            Your loan officer asked for a business plan. Get a lender-ready plan with 5-year financials, real market analysis, and a clean use of funds breakdown for $147.
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto mb-8">
            Built around the structure SBA lenders actually look for. 100% money-back guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/generate?tier=pro&purpose=sba" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
              Generate My SBA Plan - $147
            </Link>
            <Link href="/bundles" className="px-8 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-blue-300 transition">
              See Launch Pack - $297
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            One-time payment. No subscription. Money-back guarantee on Pro and bundles.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-xl sm:text-2xl font-extrabold text-blue-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12 text-sm text-amber-900">
          <p className="font-semibold mb-1">Important: read this before you buy.</p>
          <p>BizPlan Genius is not a lender, broker, or financial advisor. We do not place loans, guarantee approval, or evaluate your creditworthiness. We generate professionally structured business plans that match the format most SBA lenders expect. Your loan approval depends on your credit, collateral, business viability, and the lender&apos;s underwriting standards.</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What is in your SBA loan business plan</h2>
          <p className="text-sm text-gray-500 mb-6">Pro plan, $147. Launch Pack at $297 adds Competitor Spy, Pitch Deck, and the auto-generated website.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sections.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why borrowers use us instead of a $2,000 plan writer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border rounded-xl p-6">
              <p className="font-bold text-gray-900 mb-2">Cost</p>
              <p className="text-sm text-gray-600">Specialty SBA plan writers charge $1,500 to $3,000. Our plan is $147 with the same core structure your loan officer expects.</p>
            </div>
            <div className="bg-white border rounded-xl p-6">
              <p className="font-bold text-gray-900 mb-2">Speed</p>
              <p className="text-sm text-gray-600">Plan writers take one to three weeks. SBA submission deadlines do not wait. We deliver in 10 minutes.</p>
            </div>
            <div className="bg-white border rounded-xl p-6">
              <p className="font-bold text-gray-900 mb-2">Real data</p>
              <p className="text-sm text-gray-600">Powered by Google Gemini 2.5 with live web grounding. Real competitor pricing, real market data, not generic AI filler.</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Tell us about your business', desc: 'Loan amount, industry, location, ownership, target market. 3 minutes.' },
              { step: '2', title: 'AI builds your plan', desc: 'Real competitor research, 5-year financials, use of funds. 5 minutes.' },
              { step: '3', title: 'Submit to your lender', desc: 'Download the PDF. Submit with your SBA Form 1919 and supporting docs.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 font-bold">{s.step}</div>
                <p className="font-bold text-gray-900 mb-1">{s.title}</p>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="border rounded-xl p-5">
                <p className="font-semibold text-gray-900 mb-2">{f.q}</p>
                <p className="text-sm text-gray-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white mb-12">
          <h2 className="text-2xl font-bold mb-3">Ready to build your SBA loan plan?</h2>
          <p className="text-blue-100 mb-6">10 minutes. $147. Lender-ready format.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/generate?tier=pro&purpose=sba" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
              Generate My Plan - $147
            </Link>
            <Link href="/bundles" className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Launch Pack - $297
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">Related resources:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/e2-visa-business-plan" className="text-blue-600 hover:underline">E-2 Visa Business Plan</Link>
            <Link href="/spy" className="text-blue-600 hover:underline">Competitor Analysis</Link>
            <Link href="/pitch-deck" className="text-blue-600 hover:underline">Pitch Deck</Link>
            <Link href="/startup-cost-calculator" className="text-blue-600 hover:underline">Startup Cost Calculator</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
