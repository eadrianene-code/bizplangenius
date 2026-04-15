import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Starter Pack - 30 Days of Posts | BizPlan Genius',
  description: '30 days of ready-to-post social media content for Twitter, LinkedIn, Instagram, and Facebook. Tailored to your business. Hashtags, image ideas, and best posting times included. $29.',
  openGraph: {
    title: '30-Day Social Media Content Pack - Ready to Post',
    description: 'Get 30 days of platform-specific social posts generated from your business plan. Copy, paste, post.',
    url: 'https://www.bizplangenius.com/social-pack',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
