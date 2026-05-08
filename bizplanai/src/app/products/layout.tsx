import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { breadcrumbSchema, productSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/products' },
  title: 'All Products & Tools - From Free to Full Business Kit | BizPlan Genius',
  description: 'Browse all BizPlan Genius products: 6 free tools, business plans, website builder, pitch decks, brand kits, legal pages, ad copy, social packs, and bundles. From $0 to $397.',
  openGraph: {
    title: 'All Products - BizPlan Genius',
    description: 'Everything you need to go from idea to running business. Free tools, one-time products, bundles, and subscriptions.',
    url: `${SITE.url}/products`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'BizPlan Genius Products' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizPlan Genius - All Products',
    description: 'Everything you need to launch your business. Free tools to $397 Full Kit.',
    images: ['/api/og'],
  },
};

const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'BizPlan Genius Products',
  itemListElement: [
    { type: 'Plan Pro', url: '/generate?tier=pro', price: PRICING.planPro },
    { type: 'Competitor Spy', url: '/spy', price: PRICING.spy },
    { type: 'Plan Starter', url: '/generate', price: PRICING.planStarter },
    { type: 'Website Builder', url: '/build-website', price: PRICING.websiteBuilder },
    { type: 'Pitch Deck', url: '/pitch-deck', price: PRICING.pitchDeck },
    { type: 'Brand Kit', url: '/brand-kit', price: PRICING.brandKit },
    { type: 'Social Pack', url: '/social-pack', price: PRICING.socialPack },
    { type: 'Investor Emails', url: '/investor-emails', price: PRICING.investorEmails },
    { type: 'Legal Pages', url: '/legal-pages', price: PRICING.legalPages },
    { type: 'Ad Copy', url: '/ad-copy', price: PRICING.adCopy },
    { type: 'Full Business Kit', url: '/bundles', price: PRICING.bundleFull },
  ].map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.type,
    url: `${SITE.url}${it.url}`,
    item: {
      '@type': 'Product',
      name: it.type,
      url: `${SITE.url}${it.url}`,
      offers: {
        '@type': 'Offer',
        price: it.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
  })),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        itemList,
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
