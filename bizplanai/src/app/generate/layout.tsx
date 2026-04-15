import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generate Your AI Business Plan - Investor-Ready in Minutes | BizPlan Genius',
  description:
    'Create a professional business plan with real competitor research and market data. AI-powered, investor-ready PDF. Starter $29, Pro $49. One-time payment.',
  keywords:
    'generate business plan, AI business plan, business plan generator, investor ready business plan, business plan PDF, startup business plan',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Generate Your AI Business Plan - Ready in Minutes',
    description:
      'Professional business plan with real competitor data and 3-year financial projections. From $29, one-time payment.',
    url: 'https://www.bizplangenius.com/generate',
    siteName: 'BizPlan Genius',
    type: 'website',
  },
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
