import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/bundles',
  },
  title: 'Bundle Pricing - Save on Business Launch Tools | BizPlan Genius',
  description: 'Save up to $85 with BizPlan Genius bundles. Starter ($197): Spy + Plan. Launch Pack ($297): Spy + Plan + Website + Pitch. Full Kit ($397): Everything you need to launch.',
  openGraph: {
    title: 'Bundle Pricing - Save More, Launch Faster',
    description: 'Get everything you need to launch your business at a discount. Bundles from $197.',
    url: 'https://www.bizplangenius.com/bundles',
    siteName: 'BizPlan Genius',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Save+%24182+With+Bundles&subtitle=Spy+%2B+Plan+from+%24197.+Add+Website+%2B+Pitch+for+%24297.+Full+Business+Kit+%24397.&badge=Bundles',
        width: 1200,
        height: 630,
        alt: 'BizPlan Genius Bundles - Save up to $182',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizPlan Genius Bundles - Save up to $182',
    description: 'Spy + Plan + Website + Pitch Deck. From $197.',
    images: ['/api/og?title=Save+%24182+With+Bundles&subtitle=Spy+%2B+Plan+from+%24197.+Add+Website+%2B+Pitch+for+%24297.+Full+Business+Kit+%24397.&badge=Bundles'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
