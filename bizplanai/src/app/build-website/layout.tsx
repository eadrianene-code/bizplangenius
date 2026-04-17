import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/build-website',
  },
  title: 'Turn Your Business Plan Into a Website in 2 Minutes | BizPlan Genius',
  description: 'The only AI website builder that uses your business plan as the source of truth. Homepage copy, pricing page, and about page build themselves from your plan data. 6 types available: landing, e-commerce, booking, restaurant, portfolio, SaaS. Starting at $99.',
  keywords: 'AI website builder, business plan website, website from business plan, AI website generator, landing page builder, ecommerce website builder, SaaS website builder, restaurant website builder',
  openGraph: {
    title: 'Your Business Plan Just Built Your Website.',
    description: 'The only AI platform that turns your business plan directly into your live website. One flow. No copywriter. No Squarespace. Starts at $99.',
    url: 'https://www.bizplangenius.com/build-website',
    siteName: 'BizPlan Genius',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Your+Business+Plan+Just+Built+Your+Website.&subtitle=One+flow.+Plan+to+live+website.+%24199.&badge=Plan+%E2%86%92+Website',
        width: 1200,
        height: 630,
        alt: 'Your business plan just built your website - BizPlan Genius',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Business Plan Just Built Your Website.',
    description: 'The only AI that writes your plan AND turns it into your actual website. One flow. Starts at $99.',
    images: ['/api/og?title=Your+Business+Plan+Just+Built+Your+Website.&subtitle=One+flow.+Plan+to+live+website.+%24199.&badge=Plan+%E2%86%92+Website'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "AI Website Builder - Built From Your Business Plan",
            "description": "The only AI website builder that generates your website directly from your business plan. Your homepage copy, pricing page, and about page are built from the same source of truth as your plan. 6 website types: landing, e-commerce, booking, restaurant, portfolio, SaaS.",
            "url": "https://www.bizplangenius.com/build-website",
            "brand": {
              "@type": "Brand",
              "name": "BizPlan Genius"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "99.00",
              "highPrice": "199.00",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": "https://www.bizplangenius.com/build-website"
            }
          })
        }}
      />
      {children}
    </>
  );
}
