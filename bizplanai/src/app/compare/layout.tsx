import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BizPlan Genius vs ChatGPT vs LivePlan vs Consultants | Honest Comparison',
  description: 'Compare BizPlan Genius with ChatGPT, LivePlan, Enloop, and hiring a consultant. See pricing, features, data quality, and which option is best for your business plan.',
  alternates: {
    canonical: '/compare',
  },
  openGraph: {
    title: 'AI Business Plan Generator Comparison - BizPlan Genius vs ChatGPT vs LivePlan',
    description: 'Honest comparison of business plan tools. Real data vs templates vs AI hallucinations. See which tool is right for you.',
    url: 'https://www.bizplangenius.com/compare',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
