import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: {
    canonical: '/business-name-generator',
  },
  title: 'Free AI Business Name Generator - 10 Unique Names in Seconds | BizPlan Genius',
  description: 'Generate 10 unique business name ideas with taglines and domain suggestions. Free AI-powered business name generator. No payment required.',
  openGraph: {
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Free AI Business Name Generator' }],
    title: 'Free AI Business Name Generator - 10 Names in Seconds',
    description: 'Describe your business idea, pick a style, get 10 creative business names with taglines and domain suggestions. 100% free.',
    url: 'https://www.bizplangenius.com/business-name-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Business Name Generator',
    description: 'Free AI Business Name Generator.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <SchemaJsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Name Generator', url: '/business-name-generator' },
      ])} />
      {children}
    </>
  );
}
