import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: 'BizPlan Genius vs ChatGPT vs LivePlan vs Consultants | Honest Comparison',
  description: 'Compare BizPlan Genius with ChatGPT, LivePlan, Enloop, and hiring a consultant. See pricing, features, data quality, and which option is best for your business plan.',
  alternates: {
    canonical: '/compare',
  },
  openGraph: {
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'BizPlan Genius vs Alternatives' }],
    title: 'AI Business Plan Generator Comparison - BizPlan Genius vs ChatGPT vs LivePlan',
    description: 'Honest comparison of business plan tools. Real data vs templates vs AI hallucinations. See which tool is right for you.',
    url: 'https://www.bizplangenius.com/compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizPlan Genius vs Alternatives',
    description: 'BizPlan Genius vs Alternatives.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <SchemaJsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Compare', url: '/compare' },
      ])} />
      {children}
    </>
  );
}
