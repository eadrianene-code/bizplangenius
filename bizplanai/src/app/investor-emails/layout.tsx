import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { productSchema, breadcrumbSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/investor-emails' },
  title: 'Investor Email Templates - Cold Outreach That Books Meetings | BizPlan Genius',
  description: 'Cold outreach email sequences proven to book founder meetings with VCs and angels. Subject lines, follow-ups, and reply playbooks. $19.',
  openGraph: {
    title: 'Investor Email Templates - Cold Outreach Sequences',
    description: 'Cold outreach emails that get founder meetings. Subject lines, sequences, and reply playbooks for VCs and angels.',
    url: `${SITE.url}/investor-emails`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Investor Email Templates' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investor Email Templates That Book Meetings',
    description: 'Proven cold outreach sequences for founders raising from VCs and angels.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'Investor Email Templates',
          description: 'Cold outreach email sequences with subject lines, follow-ups, and reply playbooks for founders raising from VCs and angel investors.',
          url: `${SITE.url}/investor-emails`,
          price: PRICING.investorEmails,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Investor Email Templates', url: '/investor-emails' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
