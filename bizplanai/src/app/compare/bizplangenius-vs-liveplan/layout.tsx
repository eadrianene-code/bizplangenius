import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema, productSchema, faqSchema, SITE, PRICING } from '@/lib/schemas';

const URL = `${SITE.url}/compare/bizplangenius-vs-liveplan`;

export const metadata: Metadata = {
  alternates: { canonical: '/compare/bizplangenius-vs-liveplan' },
  title: 'BizPlan Genius vs LivePlan: Honest 2026 Comparison',
  description: 'Side-by-side comparison of BizPlan Genius and LivePlan: pricing, AI features, real competitor data, financial models, support, and which tool fits which buyer.',
  openGraph: {
    title: 'BizPlan Genius vs LivePlan (2026)',
    description: 'Pricing, features, financial models, support, and the buyer profile each tool fits best.',
    url: URL,
    siteName: SITE.name,
    type: 'article',
    images: [{ url: '/api/og?title=BizPlan+Genius+vs+LivePlan&subtitle=Honest+2026+comparison&badge=Compare', width: 1200, height: 630, alt: 'BizPlan Genius vs LivePlan comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizPlan Genius vs LivePlan (2026)',
    description: 'Pricing, features, and which buyer each tool fits.',
    images: ['/api/og?title=BizPlan+Genius+vs+LivePlan&subtitle=Honest+2026+comparison&badge=Compare'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'BizPlan Genius - Business Plan Pro',
          description: 'AI-generated investor-ready business plan with 9 sections, 3-year financials, real competitor research, operations plan, and risk analysis.',
          url: `${SITE.url}/generate?tier=pro`,
          price: PRICING.planPro,
        }),
        productSchema({
          name: 'LivePlan',
          description: 'Subscription business planning software with templates and financial forecasting tools.',
          url: 'https://www.liveplan.com/',
          price: '20.00',
          brand: 'Palo Alto Software',
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/compare' },
          { name: 'BizPlan Genius vs LivePlan', url: '/compare/bizplangenius-vs-liveplan' },
        ]),
        faqSchema([
          { question: 'Is BizPlan Genius cheaper than LivePlan?', answer: 'BizPlan Genius is a one-time $97 (Starter) or $147 (Pro) purchase. LivePlan is a subscription starting at $20 per month, billed monthly or annually. Over 12 months, LivePlan costs $240; over 24 months, $480. BizPlan Genius is cheaper for any timeframe.' },
          { question: 'Does LivePlan have AI generation?', answer: 'LivePlan added AI assistance in 2024 but the core flow remains template-driven. BizPlan Genius generates the full plan from a single business description plus live competitor research.' },
          { question: 'Which tool produces real competitor data?', answer: 'BizPlan Genius uses Gemini 2.5 Flash with Google Search grounding to pull real competitor pricing, positioning, and weaknesses. LivePlan provides industry benchmarks but does not pull live competitor data into your plan.' },
          { question: 'Can I export to PDF?', answer: 'Both tools export to PDF. BizPlan Genius produces a clean PDF as part of every purchase. LivePlan PDF export is included in subscriptions.' },
        ]),
      ]} />
      {children}
    </>
  );
}
