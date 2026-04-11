import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About BizPlan Genius | Why I Built This',
  description:
    'BizPlan Genius was built because AI business plans were full of fake data. We changed that with real competitor research and market analysis powered by Google Search.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Why I Built BizPlan Genius</h1>

        <div className="prose prose-lg prose-gray max-w-none">
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            I tried every AI business plan tool out there. They all had the same problem: fake data.
            Made-up competitors. Invented market sizes. Financial projections pulled from thin air.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            You could hand one of those plans to an investor and they'd spot the BS in 30 seconds.
            A bank loan officer would toss it. And if you actually tried to use it to run your business,
            you'd be making decisions based on fiction.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            That bothered me. So I built something different.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">What makes this different</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            BizPlan Genius uses AI with real-time Google Search grounding. That means when it writes about
            your competitors, it's pulling actual company names, real pricing, and real customer reviews.
            When it estimates your market size, it's using published industry reports and data.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            The result is a business plan with information you can actually verify. Names you can Google.
            Numbers with sources. A competitive landscape that reflects reality, not what a language model
            hallucinated.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">The Competitor Spy tool</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            I also built a standalone competitive analysis tool for $19. You tell it your business or idea,
            and it finds 10-15 real competitors, analyzes their pricing, runs a SWOT analysis, identifies
            their weak spots, and gives you a 90-day plan to beat them.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Most competitor analysis tools charge $99+/month as a subscription. This is $19, one time, and
            you get a PDF you own forever.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">My guarantee</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            If you're not happy with your business plan or spy report, I'll refund you. No questions asked.
            I'd rather lose $49 than have someone feel like they wasted their money.
          </p>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Ready to try it?</h2>
            <p className="text-blue-100 mb-6">
              Business plans from $29. Competitor reports for $19. Real data, not AI filler.
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

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} BizPlan Genius. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">Home</a>
            <a href="/spy" className="text-sm text-gray-500 hover:text-gray-700">Competitor Spy</a>
            <a href="/blog" className="text-sm text-gray-500 hover:text-gray-700">Blog</a>
            <a href="/about" className="text-sm text-gray-500 hover:text-gray-700">About</a>
            <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
            <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
            <a href="mailto:support@bizplangenius.com" className="text-sm text-gray-500 hover:text-gray-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
