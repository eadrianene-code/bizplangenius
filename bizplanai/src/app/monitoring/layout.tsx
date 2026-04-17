import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/monitoring',
  },
  title: 'Competitor Monitoring & Monthly Social Pack - Subscriptions | BizPlan Genius',
  description: 'Stay ahead with monthly competitor intelligence ($15/mo) and fresh social media content ($19/mo). Auto-updated reports, new competitor alerts, and 30 new posts every month.',
  openGraph: {
    title: 'Monthly Subscriptions - Competitor Monitoring & Social Media',
    description: 'Never fall behind. Get updated competitor reports and fresh social content delivered monthly.',
    url: 'https://www.bizplangenius.com/monitoring',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
