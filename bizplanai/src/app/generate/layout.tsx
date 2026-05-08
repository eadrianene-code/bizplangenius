import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { productSchema, breadcrumbSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/generate' },
  title: 'AI Business Plan Generator - Investor-Ready in Minutes | BizPlan Genius',
  description: 'Generate an investor-ready business plan with real competitor research and 3-year financials. Starter $97 or Pro $147 with Operations, Risk Analysis, and money-back guarantee.',
  robots: { index: false, follow: true }, // gen tool, not a marketing page
  openGraph: {
    title: 'AI Business Plan Generator - BizPlan Genius',
    description: 'Investor-ready business plan with real competitor data and 3-year financials. Starter $97, Pro $147.',
    url: `${SITE.url}/generate`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'AI Business Plan Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Business Plan Generator',
    description: 'Investor-ready plan with real competitor data and 3-year financials.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'Business Plan Pro',
          description: 'Investor-ready AI business plan with 9 sections, 3-year financial projections, operations plan, risk analysis, and money-back guarantee.',
          url: `${SITE.url}/generate?tier=pro`,
          price: PRICING.planPro,
        }),
        productSchema({
          name: 'Business Plan Starter',
          description: '7-section AI business plan with PDF download. Best for early-stage idea validation.',
          url: `${SITE.url}/generate`,
          price: PRICING.planStarter,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Generate Business Plan', url: '/generate' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
