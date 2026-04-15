import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Website Builder - Custom Website From Your Business Plan | BizPlan Genius',
  description: 'AI generates a custom, professional website from your business plan. 6 website types: landing page, e-commerce, booking, restaurant, portfolio, SaaS. Full source code. From $99.',
  openGraph: {
    title: 'AI Website Builder - Custom Website in 2 Minutes',
    description: 'Get a professional website built from your business plan data. Responsive, custom design, full HTML/CSS source code included.',
    url: 'https://www.bizplangenius.com/build-website',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
