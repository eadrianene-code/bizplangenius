import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { productSchema, breadcrumbSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/brand-kit' },
  title: 'AI Logo & Brand Kit - Complete Brand Identity | BizPlan Genius',
  description: 'AI-generated brand identity: 3 logo concepts, color palette, typography, brand voice guidelines, social media bio, and elevator pitch. Built from your business plan. $29.',
  openGraph: {
    title: 'AI Logo & Brand Kit - Professional Brand Identity',
    description: 'Get 3 logo concepts, 5-color palette, typography, brand voice, and social media guidelines tailored to your business.',
    url: `${SITE.url}/brand-kit`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'BizPlan Genius Brand Kit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Brand Kit - Logo, Color Palette, Typography',
    description: 'Three logo concepts, color palette, typography system, voice guidelines. Built from your business plan.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'AI Logo and Brand Kit',
          description: 'Three logo concepts, five-color palette, typography system, brand voice, and social media bio templates generated from your business plan.',
          url: `${SITE.url}/brand-kit`,
          price: PRICING.brandKit,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Brand Kit', url: '/brand-kit' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
