import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Competitor Spy Tool | Find Your Competitors\' Weaknesses for $19',
  description:
    'Enter your business idea and get 10-15 real competitors analyzed with pricing, SWOT analysis, vulnerability audit, and a 90-day tactical roadmap. One-time $19 payment. PDF delivered in minutes.',
  keywords:
    'competitor analysis tool, competitive intelligence, SWOT analysis, competitor research, business competitor spy, market analysis',
  alternates: {
    canonical: '/spy',
  },
  openGraph: {
    title: 'Competitor Spy Tool | Know Your Competitors\' Weaknesses',
    description:
      'Get 10-15 real competitors analyzed with pricing, SWOT, vulnerability audit, and 90-day action plan. $19 one-time. PDF in minutes.',
    url: 'https://www.bizplangenius.com/spy',
    siteName: 'BizPlan Genius',
    type: 'website',
  },
};

export default function SpyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
