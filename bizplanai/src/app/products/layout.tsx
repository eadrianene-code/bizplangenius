import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products & Tools - From Free to Full Business Kit | BizPlan Genius',
  description: 'Browse all BizPlan Genius products: 6 free tools, business plans, website builder, pitch decks, brand kits, legal pages, ad copy, social packs, and bundles. From $0 to $349.',
  openGraph: {
    title: 'All Products - BizPlan Genius',
    description: 'Everything you need to go from idea to running business. Free tools, one-time products, bundles, and subscriptions.',
    url: 'https://www.bizplangenius.com/products',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
