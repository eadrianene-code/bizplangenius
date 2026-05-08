import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { productSchema, breadcrumbSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/bundles' },
  title: 'Business Plan Bundles - Save 19-22% | BizPlan Genius',
  description: 'Three bundles to launch your business: Starter ($197), Launch Pack ($297), and Full Business Kit ($397). Save up to 22% vs buying individually.',
  openGraph: {
    title: 'Business Plan Bundles - Save 19-22%',
    description: 'Bundle BizPlan Genius products and save. Starter ($197), Launch Pack ($297), Full Kit ($397).',
    url: `${SITE.url}/bundles`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'BizPlan Genius Bundles' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizPlan Genius Bundles',
    description: 'Save 19-22% with Starter, Launch Pack, or Full Business Kit bundles.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'Full Business Kit',
          description: 'All 12 BizPlan Genius products bundled: Competitor Spy, Business Plan Pro, Website Builder, Pitch Deck, Brand Kit, Social Pack, and more. Save 22% vs buying individually.',
          url: `${SITE.url}/bundles`,
          price: PRICING.bundleFull,
        }),
        productSchema({
          name: 'Launch Pack',
          description: 'Competitor Spy + Business Plan Pro + Website Builder + Pitch Deck. Everything to launch with a website.',
          url: `${SITE.url}/bundles`,
          price: PRICING.bundleLaunch,
        }),
        productSchema({
          name: 'Starter Bundle',
          description: 'Competitor Spy + Business Plan Pro. The two essentials to validate and document your business.',
          url: `${SITE.url}/bundles`,
          price: PRICING.bundleStarter,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Bundles', url: '/bundles' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
