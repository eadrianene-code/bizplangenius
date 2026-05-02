import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getIndustryBySlug, getAllIndustrySlugs, INDUSTRIES } from '@/lib/industries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllIndustrySlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getIndustryBySlug(slug);
  if (!data) return { title: 'Not Found' };

  return {
    title: `${data.title} | BizPlan Genius`,
    description: data.description,
    alternates: { canonical: `/plans/${slug}` },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://www.bizplangenius.com/plans/${slug}`,
      siteName: 'BizPlan Genius',
    },
    twitter: { card: 'summary_large_image', title: data.title, description: data.description },
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getIndustryBySlug(slug);
  if (!data) notFound();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">BizPlan Genius</Link>
          <Link href={`/generate?tier=pro&industry=${encodeURIComponent(data.industry)}`} className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Generate {data.name} Plan - $97
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-5xl mb-4 block">{data.icon}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{data.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">{data.heroText}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/generate?tier=pro&industry=${encodeURIComponent(data.industry)}`} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
              Generate My {data.name} Plan - $97
            </Link>
            <Link href="/free-competitor-check" className="px-8 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-blue-300 transition">
              Free Competitor Check
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-12">
          {data.stats.map((s, i) => (
            <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-xl sm:text-2xl font-extrabold text-blue-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's in your {data.name.toLowerCase()} business plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.sections.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                <span className="text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Describe your concept', desc: `Tell us about your ${data.name.toLowerCase()} idea, location, and target market` },
              { step: '2', title: 'AI researches your market', desc: 'Our AI finds real competitors, pricing data, and market trends' },
              { step: '3', title: 'Get your plan', desc: 'Download your investor-ready PDF in under 10 minutes' },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">FAQ</h2>
          <div className="space-y-4">
            {data.faq.map((f, i) => (
              <div key={i} className="border rounded-xl p-5">
                <p className="font-semibold text-gray-900 mb-2">{f.q}</p>
                <p className="text-sm text-gray-600">{f.a}</p>
              </div>
            ))}
            <div className="border rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-2">How much does it cost?</p>
              <p className="text-sm text-gray-600">Starter $97, Pro $147 (includes operations, risk analysis, money-back guarantee). One-time payment.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white mb-12">
          <h2 className="text-2xl font-bold mb-3">Ready to create your {data.name.toLowerCase()} business plan?</h2>
          <p className="text-blue-100 mb-6">Real competitor data. Real financial projections. Ready in minutes.</p>
          <Link href={`/generate?tier=pro&industry=${encodeURIComponent(data.industry)}`} className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
            Generate My Plan - $97
          </Link>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">Other industry plans:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {INDUSTRIES.filter(i => i.slug !== slug).map(i => (
              <Link key={i.slug} href={`/plans/${i.slug}`} className="text-sm text-blue-600 hover:underline px-2 py-1">
                {i.name}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
