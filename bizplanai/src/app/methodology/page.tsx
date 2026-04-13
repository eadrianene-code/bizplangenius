import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Methodology | How BizPlan Genius Generates Real Data',
  description:
    'How we use Google Gemini 2.5 Flash with live Google Search grounding to produce business plans and competitor reports with real, verifiable data instead of AI hallucinations.',
  alternates: {
    canonical: '/methodology',
  },
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gray-900">
            BizPlan Genius
          </a>
          <nav className="flex gap-6 items-center">
            <a href="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Blog
            </a>
            <a href="/spy" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Competitor Spy
            </a>
            <a
              href="/#pricing"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Your Plan
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Methodology</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-10">
          How we generate business plans and competitor reports with real, verifiable data instead of AI hallucinations.
        </p>

        <div className="prose prose-lg prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The model: Google Gemini 2.5 Flash</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We use Google&apos;s Gemini 2.5 Flash large language model to synthesize and structure every report.
            Gemini 2.5 was chosen because it supports native Google Search grounding, has a 1M token context window
            (large enough to reason over an entire industry&apos;s worth of source material in a single pass), and
            consistently outperforms general-purpose models on factual retrieval benchmarks.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Live Google Search grounding</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            This is the part most AI tools skip. Standard ChatGPT or Claude responses are generated from a frozen
            training snapshot, which is why competitor names get invented, market sizes get fabricated, and pricing
            data is years out of date.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Every BizPlan Genius and Competitor Spy report runs through Gemini&apos;s Google Search grounding API.
            That means before the model writes anything, it issues live search queries against the public web,
            pulls back current results, and is forced to cite source URLs as it reasons. If a competitor doesn&apos;t
            exist on the live web, the model can&apos;t hallucinate one in.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">What that gives you</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Competitor names you can Google and verify in 10 seconds</li>
            <li>Pricing pulled from each competitor&apos;s actual website at generation time</li>
            <li>Market size figures sourced from published industry reports, not invented</li>
            <li>SWOT and vulnerability analysis grounded in real customer reviews and public data</li>
            <li>Reports stamped with the date they were generated so you know how fresh the data is</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">What it cannot do</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We are upfront about limits. Our system can only see what is publicly indexed on the web. It cannot
            access paywalled databases, private financial filings, or competitor data behind a login. Private
            companies will have less detail than public ones. For very niche regional markets, public data may be
            thin and we say so in the report rather than inventing numbers.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">How we structure the output</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Business plans follow a 7-section format that matches what banks, the SBA, and most accelerators expect:
            executive summary, company description, market analysis, organization and management, products and
            services, marketing and sales strategy, and 3-year financial projections. The Pro tier adds an
            operations plan and a risk analysis section.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Competitor Spy reports include 10 to 15 named competitors, side-by-side pricing, a SWOT for each,
            a vulnerability audit identifying where each competitor is weak, and a 90-day tactical roadmap for
            how to attack those weaknesses.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our refund policy</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            If a report contains data you can show is fabricated, or if you simply aren&apos;t happy with the
            output, email support@bizplangenius.com and we refund you. No friction, no forms.
          </p>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">See it for yourself</h2>
            <p className="text-blue-100 mb-6">
              Generate a real business plan or competitor report and verify every data point yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#pricing"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Get Your Business Plan
              </a>
              <a
                href="/spy"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Try Competitor Spy
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} BizPlan Genius. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">Home</a>
            <a href="/spy" className="text-sm text-gray-500 hover:text-gray-700">Competitor Spy</a>
            <a href="/blog" className="text-sm text-gray-500 hover:text-gray-700">Blog</a>
            <a href="/about" className="text-sm text-gray-500 hover:text-gray-700">About</a>
            <a href="/methodology" className="text-sm text-gray-500 hover:text-gray-700">Methodology</a>
            <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
            <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
            <a href="mailto:support@bizplangenius.com" className="text-sm text-gray-500 hover:text-gray-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
