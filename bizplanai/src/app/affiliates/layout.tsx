import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Program - Earn 20% Commission | BizPlan Genius',
  description: 'Join the BizPlan Genius affiliate program. Earn 20% commission on every sale. Share your unique link, track clicks and conversions, get paid monthly.',
  openGraph: {
    title: 'BizPlan Genius Affiliate Program - Earn 20% Per Sale',
    description: 'Recommend BizPlan Genius to founders and earn 20% of every sale. Lifetime cookie. Monthly payouts.',
    url: 'https://www.bizplangenius.com/affiliates',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
