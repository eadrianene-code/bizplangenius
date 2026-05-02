import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/generate',
  },
  title: 'Generate Your AI Business Plan - Investor-Ready in Minutes | BizPlan Genius',
  description:
    'Create a professional business plan with real competitor research and market data. AI-powered, investor-ready PDF. Starter $97, Pro $147. One-time payment.',
  keywords:
    'generate business plan, AI business plan, business plan generator, investor ready business plan, business plan PDF, startup business plan',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Generate Your AI Business Plan - Ready in Minutes',
    description:
      'Professional business plan with real competitor data and 3-year financial projections. From $97, one-time payment.',
    url: 'https://www.bizplangenius.com/generate',
    siteName: 'BizPlan Genius',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Investor-Ready+Business+Plan&subtitle=Real+competitor+data.+3-year+financials.+PDF+in+10+minutes.+Starter+%2497%2C+Pro+%24147.&badge=Business+Plan',
        width: 1200,
        height: 630,
        alt: 'BizPlan Genius - Investor-ready business plan from $97',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investor-Ready Business Plan from $97',
    description: 'Real competitor data + 3-year financials + PDF in 10 minutes.',
    images: ['/api/og?title=Investor-Ready+Business+Plan&subtitle=Real+competitor+data.+3-year+financials.+PDF+in+10+minutes.+Starter+%2497%2C+Pro+%24147.&badge=Business+Plan'],
  },
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
