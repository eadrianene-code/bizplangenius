import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Competitor Analysis Tool - Find Competitor Weaknesses for $97 | BizPlan Genius',
  description:
    'Get 10-15 real competitors analyzed with pricing, SWOT analysis, vulnerability audit, and 90-day tactical roadmap. One-time $97 payment. Full PDF report in minutes.',
  keywords:
    'competitor analysis tool, competitive intelligence, SWOT analysis, competitor research, business competitor spy, market analysis, competitor pricing analysis',
  alternates: {
    canonical: '/spy',
  },
  openGraph: {
    title: 'Competitor Analysis Tool - Real Competitor Data for $97',
    description:
      'Get 10-15 real competitors analyzed with pricing, SWOT, vulnerability audit, and 90-day action plan. $97 one-time. Full PDF report in minutes.',
    url: 'https://www.bizplangenius.com/spy',
    siteName: 'BizPlan Genius',
    type: 'website',
  },
};

export default function SpyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Competitor Spy - Competitive Analysis Report",
            "description": "AI-powered competitive analysis tool. Get 10-15 real competitors analyzed with pricing, SWOT analysis, vulnerability audit, and 90-day tactical roadmap.",
            "url": "https://www.bizplangenius.com/spy",
            "brand": {
              "@type": "Brand",
              "name": "BizPlan Genius"
            },
            "offers": {
              "@type": "Offer",
              "price": "19.00",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31",
              "url": "https://www.bizplangenius.com/spy"
            }
          })
        }}
      />
      {children}
    </>
  );
}
