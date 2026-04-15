import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ad Copy Generator - Google Ads + Facebook + Instagram | BizPlan Genius',
  description: 'Generate 15 ad variations for Google, Facebook, and Instagram. Headlines, copy, keywords, targeting, and creative ideas. Ready to launch. $19.',
  openGraph: {
    title: 'Ad Copy Generator - 15 Ads for Google, Facebook & Instagram',
    description: 'Stop staring at blank ad fields. Generate compelling ad copy with targeting suggestions and creative ideas.',
    url: 'https://www.bizplangenius.com/ad-copy',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
