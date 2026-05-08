import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: {
    canonical: '/refer',
  },
  title: 'Refer & Earn - BizPlan Genius Referral Program',
  description: 'Share BizPlan Genius with other founders and earn rewards. Get a unique referral link, share on social media, and track your referrals.',
  openGraph: {
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'BizPlan Genius Referral Program' }],
    title: 'Refer & Earn - BizPlan Genius',
    description: 'Share your referral link with founders. When they sign up, you both benefit.',
    url: 'https://www.bizplangenius.com/refer',
    siteName: 'BizPlan Genius',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizPlan Genius Referral Program',
    description: 'BizPlan Genius Referral Program.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <SchemaJsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Refer', url: '/refer' },
      ])} />
      {children}
    </>
  );
}
