import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Website Builder - 6 Types: E-commerce, Restaurant, SaaS & More | BizPlan Genius',
  description: 'AI builds your website from your business plan. Choose from 6 types: landing page ($99), e-commerce store ($149), booking site ($129), restaurant ($129), portfolio ($99), SaaS product ($199). Multi-page, editable, downloadable source code.',
  openGraph: {
    title: 'AI Website Builder - Custom Website in 2 Minutes',
    description: 'Get a professional website built from your business plan data. Responsive, custom design, full HTML/CSS source code included.',
    url: 'https://www.bizplangenius.com/build-website',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
