import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/startup-cost-calculator',
  },
  title: 'Free Startup Cost Calculator - Real Estimates for Any Business | BizPlan Genius',
  description: 'Calculate startup costs for any business type. Free AI-powered estimates with cost breakdowns, monthly operating costs, and break-even timeline. Real market data.',
  openGraph: {
    title: 'Free Startup Cost Calculator - How Much Does It Cost to Start Your Business?',
    description: 'Get a detailed cost estimate for starting your business. Includes one-time costs, monthly operating expenses, and break-even timeline.',
    url: 'https://www.bizplangenius.com/startup-cost-calculator',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
