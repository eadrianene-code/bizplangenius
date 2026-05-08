import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: {
    canonical: '/launch-checklist',
  },
  title: 'Free Business Launch Checklist - Step-by-Step Guide | BizPlan Genius',
  description: 'Get a personalized checklist to legally start your business. LLC registration, permits, licenses, bank accounts, and marketing - specific to your state and industry. Free.',
  openGraph: {
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Free Business Launch Checklist' }],
    title: 'Free Business Launch Checklist - Every Step to Start Your Business',
    description: 'Personalized step-by-step checklist: legal registration, permits, finances, branding, and marketing. Specific to your state.',
    url: 'https://www.bizplangenius.com/launch-checklist',
    siteName: 'BizPlan Genius',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Business Launch Checklist',
    description: 'Free Business Launch Checklist.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {   return (
    <>
      <SchemaJsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Launch Checklist', url: '/launch-checklist' },
      ])} />
      {children}
    </>
  ); }
