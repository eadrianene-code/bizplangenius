import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { productSchema, breadcrumbSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/monitoring' },
  title: 'Competitor Monitoring - Quarterly Refresh + Alerts | BizPlan Genius',
  description: 'Quarterly competitor refresh with change-detection alerts. New competitors, pricing changes, feature launches. From $15/mo.',
  openGraph: {
    title: 'Competitor Monitoring - Quarterly Refresh + Alerts',
    description: 'Stay ahead of competitor moves with quarterly refresh and change-detection alerts.',
    url: `${SITE.url}/monitoring`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Competitor Monitoring' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Competitor Monitoring Subscription',
    description: 'Quarterly competitor refresh with change-detection alerts.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'Competitor Monitoring Subscription',
          description: 'Ongoing competitor tracking with quarterly refresh, change-detection alerts on pricing, new entrants, and feature launches.',
          url: `${SITE.url}/monitoring`,
          price: PRICING.subMonitoring,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Competitor Monitoring', url: '/monitoring' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
