import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refer & Earn - BizPlan Genius Referral Program',
  description: 'Share BizPlan Genius with other founders and earn rewards. Get a unique referral link, share on social media, and track your referrals.',
  openGraph: {
    title: 'Refer & Earn - BizPlan Genius',
    description: 'Share your referral link with founders. When they sign up, you both benefit.',
    url: 'https://www.bizplangenius.com/refer',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
