import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: {
    canonical: '/domain-guide',
  },
  title: 'Domain & Hosting Setup Guide - Get Your Website Live | BizPlan Genius',
  description: 'Step-by-step guide to buy a domain, set up hosting, and get your website live. Written for complete beginners. Includes free hosting options.',
  openGraph: {
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Domain and Hosting Setup Guide' }],
    title: 'Get Your Website Live - Domain & Hosting Guide for Beginners',
    description: 'Buy a domain for $9/year, host your website for free. Step-by-step instructions anyone can follow.',
    url: 'https://www.bizplangenius.com/domain-guide',
    siteName: 'BizPlan Genius',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domain and Hosting Setup Guide',
    description: 'Domain and Hosting Setup Guide.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {   return (
    <>
      <SchemaJsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Domain Guide', url: '/domain-guide' },
      ])} />
      {children}
    </>
  ); }
