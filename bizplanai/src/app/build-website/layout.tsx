import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { breadcrumbSchema, SITE, PRICING } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/build-website' },
  title: 'Turn Your Business Plan Into a Website in 2 Minutes | BizPlan Genius',
  description: 'The only AI website builder that uses your business plan as the source of truth. Homepage copy, pricing page, and about page build themselves from your plan data. 6 types available: landing, e-commerce, booking, restaurant, portfolio, SaaS. Starting at $99.',
  keywords: 'AI website builder, business plan website, website from business plan, AI website generator, landing page builder, ecommerce website builder, SaaS website builder, restaurant website builder',
  openGraph: {
    title: 'Your Business Plan Just Built Your Website.',
    description: 'The only AI platform that turns your business plan directly into your live website. One flow. No copywriter. No Squarespace. Starts at $99.',
    url: `${SITE.url}/build-website`,
    siteName: SITE.name,
    type: 'website',
    images: [{
      url: '/api/og?title=Your+Business+Plan+Just+Built+Your+Website.&subtitle=One+flow.+Plan+to+live+website.+Launch+Pack+%24297.&badge=Plan+-%3E+Website',
      width: 1200,
      height: 630,
      alt: 'Your business plan just built your website - BizPlan Genius',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Business Plan Just Built Your Website.',
    description: 'The only AI that writes your plan AND turns it into your actual website. One flow. Starts at $99.',
    images: ['/api/og?title=Your+Business+Plan+Just+Built+Your+Website.&subtitle=One+flow.+Plan+to+live+website.+Launch+Pack+%24297.&badge=Plan+-%3E+Website'],
  },
};

const websiteProduct = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'AI Website Builder - Built From Your Business Plan',
  description: 'The only AI website builder that generates your website directly from your business plan. Your homepage copy, pricing page, and about page are built from the same source of truth as your plan. 6 website types: landing, e-commerce, booking, restaurant, portfolio, SaaS.',
  url: `${SITE.url}/build-website`,
  image: `${SITE.url}/api/og`,
  brand: { '@type': 'Brand', name: SITE.name },
  category: 'Website builder software',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: PRICING.websiteBuilder,
    highPrice: '199.00',
    priceCurrency: 'USD',
    offerCount: 6,
    availability: 'https://schema.org/InStock',
    url: `${SITE.url}/build-website`,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        websiteProduct,
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Website Builder', url: '/build-website' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
