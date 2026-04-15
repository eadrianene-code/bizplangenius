import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Logo & Brand Kit - Complete Brand Identity | BizPlan Genius',
  description: 'AI-generated brand identity: 3 logo concepts, color palette, typography, brand voice guidelines, social media bio, and elevator pitch. Built from your business plan. $29.',
  openGraph: {
    title: 'AI Logo & Brand Kit - Professional Brand Identity',
    description: 'Get 3 logo concepts, 5-color palette, typography, brand voice, and social media guidelines tailored to your business.',
    url: 'https://www.bizplangenius.com/brand-kit',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
