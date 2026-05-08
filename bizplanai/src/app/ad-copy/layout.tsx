import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { productSchema, breadcrumbSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/ad-copy' },
  title: 'Ad Copy Generator - Google Ads + Facebook + Instagram | BizPlan Genius',
  description: 'Generate 15 ad variations for Google, Facebook, and Instagram. Headlines, copy, keywords, targeting, and creative ideas. Ready to launch. $19.',
  openGraph: {
    title: 'Ad Copy Generator - 15 Ads for Google, Facebook & Instagram',
    description: 'Stop staring at blank ad fields. Generate compelling ad copy with targeting suggestions and creative ideas.',
    url: `${SITE.url}/ad-copy`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'BizPlan Genius Ad Copy Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ad Copy Generator - 15 Ads in Minutes',
    description: 'Generate 15 ad variations for Google, Facebook, and Instagram with targeting + creative ideas.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'Ad Copy Generator',
          description: '15 ready-to-launch ad variations across Google, Facebook, and Instagram with headlines, copy, keywords, targeting and creative direction.',
          url: `${SITE.url}/ad-copy`,
          price: PRICING.adCopy,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Ad Copy Generator', url: '/ad-copy' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
