import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { productSchema, breadcrumbSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/legal-pages' },
  title: 'Legal Pages Generator - Privacy, Terms, Refund Policy | BizPlan Genius',
  description: 'Generate Privacy Policy, Terms of Service, Cookie Policy, and Refund Policy customized to your business. GDPR + CCPA aware. $19.',
  openGraph: {
    title: 'Legal Pages Generator - Privacy, Terms, Cookies, Refunds',
    description: 'GDPR and CCPA aware legal pages customized to your business in minutes.',
    url: `${SITE.url}/legal-pages`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Legal Pages Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Pages Generator',
    description: 'Privacy, Terms, Cookie, and Refund policies customized to your business.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'Legal Pages Generator',
          description: 'Privacy Policy, Terms of Service, Cookie Policy, and Refund Policy customized to your business with GDPR and CCPA awareness.',
          url: `${SITE.url}/legal-pages`,
          price: PRICING.legalPages,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Legal Pages Generator', url: '/legal-pages' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
