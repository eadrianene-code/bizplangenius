import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bundle Pricing - Save on Business Launch Tools | BizPlan Genius',
  description: 'Save up to $68 with BizPlan Genius bundles. Starter ($59): Spy + Plan. Launch Pack ($199): Spy + Plan + Website + Pitch. Full Kit ($349): Everything you need to launch.',
  openGraph: {
    title: 'Bundle Pricing - Save More, Launch Faster',
    description: 'Get everything you need to launch your business at a discount. Bundles from $59.',
    url: 'https://www.bizplangenius.com/bundles',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
