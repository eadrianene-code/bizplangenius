import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Competitor Analysis Tool - Find Your Top 3 Competitors | BizPlan Genius',
  description: 'Find your top 3 competitors in 30 seconds. Free AI-powered competitor analysis tool. See their strengths, weaknesses, and your opportunity to win.',
  openGraph: {
    title: 'Free Competitor Analysis - Find Your Top 3 Competitors Instantly',
    description: 'Describe your business idea. Our AI finds 3 real competitors, their strengths, and their biggest weaknesses you can exploit. 100% free.',
    url: 'https://www.bizplangenius.com/free-competitor-check',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
