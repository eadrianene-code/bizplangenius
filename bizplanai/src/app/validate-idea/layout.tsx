import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/validate-idea',
  },
  title: 'Free Business Idea Validator - Is Your Idea Worth Pursuing? | BizPlan Genius',
  description: 'Validate your business idea with AI and real market data. Get a score across 5 categories: market demand, competition, revenue potential, barriers, and timing. 100% free.',
  openGraph: {
    title: 'Free Business Idea Validator - Score Your Idea in 30 Seconds',
    description: 'Is your business idea worth pursuing? Get an honest AI assessment with real market data, competitor analysis, and actionable next steps.',
    url: 'https://www.bizplangenius.com/validate-idea',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
