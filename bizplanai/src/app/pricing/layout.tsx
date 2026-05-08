import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { breadcrumbSchema, faqSchema, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/pricing' },
  title: 'Pricing - All Products & Subscriptions | BizPlan Genius',
  description: 'BizPlan Genius pricing: free tools, one-time products from $97, bundles from $197, and monthly subscriptions from $9/mo. Everything you need to launch your business.',
  openGraph: {
    title: 'Pricing - BizPlan Genius',
    description: 'See all products, bundles, and subscription plans. Free tools, one-time purchases, and monthly plans.',
    url: `${SITE.url}/pricing`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'BizPlan Genius Pricing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizPlan Genius Pricing',
    description: 'Free tools, one-time products from $97, bundles from $197, subs from $9/mo.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Pricing', url: '/pricing' },
        ]),
        faqSchema([
          { question: 'Why is the Full Kit only 10% off and not bigger?', answer: 'Because the math is real. Bundles in our space typically anchor against inflated original prices that no one pays. We price the bundle so each item is actually cheaper than buying it solo, and we show the line items so you can verify it.' },
          { question: 'Are there any hidden fees?', answer: 'No. One-time products are a single payment. Subscriptions are clearly priced monthly or yearly. Cancel anytime through the Stripe billing portal.' },
          { question: 'Can I upgrade from Starter to Pro?', answer: 'Yes. Buy the Pro plan at any time to add the Operations Plan, Risk Analysis, and money-back guarantee.' },
          { question: 'Which bundle should I pick?', answer: 'If you only need research and a plan, the Starter Bundle ($197) is enough. If you also need a website and pitch deck, Launch Pack ($297). If you want everything to launch a complete business including brand and social content, the Full Kit ($397) saves $43 versus separate.' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
