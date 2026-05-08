import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: {
    canonical: '/validate-idea',
  },
  title: 'Free Business Idea Validator - Is Your Idea Worth Pursuing? | BizPlan Genius',
  description: 'Validate your business idea with AI and real market data. Get a score across 5 categories: market demand, competition, revenue potential, barriers, and timing. 100% free.',
  openGraph: {
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Free AI Idea Validator' }],
    title: 'Free Business Idea Validator - Score Your Idea in 30 Seconds',
    description: 'Is your business idea worth pursuing? Get an honest AI assessment with real market data, competitor analysis, and actionable next steps.',
    url: 'https://www.bizplangenius.com/validate-idea',
    siteName: 'BizPlan Genius',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Idea Validator',
    description: 'Free AI Idea Validator.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <SchemaJsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Idea Validator', url: '/validate-idea' },
      ])} />
      {children}
    </>
  );
}
