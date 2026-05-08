import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: {
    canonical: '/affiliates',
  },
  title: 'Affiliate Program - Earn 20% Commission | BizPlan Genius',
  description: 'Join the BizPlan Genius affiliate program. Earn 20% commission on every sale. Share your unique link, track clicks and conversions, get paid monthly.',
  openGraph: {
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'BizPlan Genius Affiliate Program' }],
    title: 'BizPlan Genius Affiliate Program - Earn 20% Per Sale',
    description: 'Recommend BizPlan Genius to founders and earn 20% of every sale. Lifetime cookie. Monthly payouts.',
    url: 'https://www.bizplangenius.com/affiliates',
    siteName: 'BizPlan Genius',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizPlan Genius Affiliate Program',
    description: 'BizPlan Genius Affiliate Program.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <SchemaJsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Affiliates', url: '/affiliates' },
      ])} />
      {children}
    </>
  );
}
