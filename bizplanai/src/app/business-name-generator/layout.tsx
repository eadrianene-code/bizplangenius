import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Business Name Generator - 10 Unique Names in Seconds | BizPlan Genius',
  description: 'Generate 10 unique business name ideas with taglines and domain suggestions. Free AI-powered business name generator. No payment required.',
  openGraph: {
    title: 'Free AI Business Name Generator - 10 Names in Seconds',
    description: 'Describe your business idea, pick a style, get 10 creative business names with taglines and domain suggestions. 100% free.',
    url: 'https://www.bizplangenius.com/business-name-generator',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
