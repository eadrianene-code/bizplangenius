import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: {
    canonical: '/startup-cost-calculator',
  },
  title: 'Free Startup Cost Calculator - Real Estimates for Any Business | BizPlan Genius',
  description: 'Calculate startup costs for any business type. Free AI-powered estimates with cost breakdowns, monthly operating costs, and break-even timeline. Real market data.',
  openGraph: {
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Free Startup Cost Calculator' }],
    title: 'Free Startup Cost Calculator - How Much Does It Cost to Start Your Business?',
    description: 'Get a detailed cost estimate for starting your business. Includes one-time costs, monthly operating expenses, and break-even timeline.',
    url: 'https://www.bizplangenius.com/startup-cost-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Startup Cost Calculator',
    description: 'Free Startup Cost Calculator.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>
      <SchemaJsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Cost Calculator', url: '/startup-cost-calculator' },
      ])} />
      {children}
    </>
  );
}
