import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: {
    canonical: '/free-competitor-check',
  },
  title: 'Free Competitor Analysis Tool - Find Your Top 3 Competitors | BizPlan Genius',
  description: 'Find your top 3 competitors in 30 seconds. Free AI-powered competitor analysis tool. See their strengths, weaknesses, and your opportunity to win.',
  openGraph: {
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Free Competitor Analysis' }],
    title: 'Free Competitor Analysis - Find Your Top 3 Competitors Instantly',
    description: 'Describe your business idea. Our AI finds 3 real competitors, their strengths, and their biggest weaknesses you can exploit. 100% free.',
    url: 'https://www.bizplangenius.com/free-competitor-check',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Competitor Analysis',
    description: 'Free Competitor Analysis.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <SchemaJsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Competitor Check', url: '/free-competitor-check' },
      ])} />
      {children}
    </>
  );
}
