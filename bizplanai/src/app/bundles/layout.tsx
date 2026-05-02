import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/bundles',
  },
  title: 'Bundle Pricing - Save on Business Launch Tools | BizPlan Genius',
  description: 'Save up to $182 with BizPlan Genius bundles. Starter ($197): Spy + Plan. Launch Pack ($297): Spy + Plan + Website + Pitch. Full Kit ($447): Everything you need to launch.',
  openGraph: {
    title: 'Bundle Pricing - Save More, Launch Faster',
    description: 'Get everything you need to launch your business at a discount. Bundles from $197.',
    url: 'https://www.bizplangenius.com/bundles',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
