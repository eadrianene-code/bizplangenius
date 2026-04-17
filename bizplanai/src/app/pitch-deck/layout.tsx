import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/pitch-deck',
  },
  title: 'AI Pitch Deck Generator - 12 Investor Slides From Your Plan | BizPlan Genius',
  description: 'Generate a 12-slide investor-ready pitch deck from your business plan. Includes speaker notes, market data, financial projections, and competitive analysis. $39 one-time.',
  openGraph: {
    title: 'AI Pitch Deck Generator - Investor-Ready in Minutes',
    description: '12-slide pitch deck with speaker notes. Problem, solution, market, traction, financials, and the ask. Built from your business plan.',
    url: 'https://www.bizplangenius.com/pitch-deck',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
