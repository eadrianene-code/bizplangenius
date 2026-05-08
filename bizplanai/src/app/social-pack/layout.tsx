import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { productSchema, breadcrumbSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/social-pack' },
  title: '30-Day Social Media Pack - Brand-Aligned Content | BizPlan Genius',
  description: '30 days of social media posts with copy, hashtags, and image prompts. Brand-aligned to your business plan. One-time $29 or $19/mo for fresh monthly packs.',
  openGraph: {
    title: '30-Day Social Media Content Pack',
    description: '30 brand-aligned posts: copy, hashtags, and image prompts. Built from your business plan.',
    url: `${SITE.url}/social-pack`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Social Media Pack' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '30-Day Social Media Pack',
    description: '30 brand-aligned posts with copy, hashtags, and image prompts.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'Social Media Content Pack',
          description: '30 days of brand-aligned social media posts including copy, hashtags, and image prompts. Available as one-time purchase or monthly subscription.',
          url: `${SITE.url}/social-pack`,
          price: PRICING.socialPack,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Social Media Pack', url: '/social-pack' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
