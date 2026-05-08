import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { productSchema, breadcrumbSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/pitch-deck' },
  title: 'AI Pitch Deck Generator - Investor-Ready in Minutes | BizPlan Genius',
  description: '12-slide investor pitch deck generated from your business plan. Cover, problem, solution, market, traction, business model, financials, ask. $39.',
  openGraph: {
    title: 'AI Pitch Deck Generator - 12 Investor Slides',
    description: 'Investor-ready 12-slide pitch deck built from your business plan. Cover through ask.',
    url: `${SITE.url}/pitch-deck`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'AI Pitch Deck Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Pitch Deck - Investor-Ready 12 Slides',
    description: 'Generate a complete investor pitch deck from your business plan.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'AI Pitch Deck Generator',
          description: '12-slide investor pitch deck (cover, problem, solution, market size, traction, business model, financials, ask) generated from your business plan.',
          url: `${SITE.url}/pitch-deck`,
          price: PRICING.pitchDeck,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Pitch Deck', url: '/pitch-deck' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
