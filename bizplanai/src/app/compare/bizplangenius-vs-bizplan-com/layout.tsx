import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema, productSchema, faqSchema, SITE, PRICING } from '@/lib/schemas';

const URL = `${SITE.url}/compare/bizplangenius-vs-bizplan-com`;

export const metadata: Metadata = {
  alternates: { canonical: '/compare/bizplangenius-vs-bizplan-com' },
  title: 'BizPlan Genius vs Bizplan.com: Pricing, Features, and Which to Pick (2026)',
  description: 'Side-by-side comparison of BizPlan Genius and Bizplan.com. AI generation, competitor data, financial models, pricing, and the right buyer for each.',
  openGraph: {
    title: 'BizPlan Genius vs Bizplan.com (2026)',
    description: 'Pricing, AI features, competitor data, financials, and which buyer each tool fits best.',
    url: URL,
    siteName: SITE.name,
    type: 'article',
    images: [{ url: '/api/og?title=BizPlan+Genius+vs+Bizplan.com&subtitle=Honest+2026+comparison&badge=Compare', width: 1200, height: 630, alt: 'BizPlan Genius vs Bizplan.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizPlan Genius vs Bizplan.com (2026)',
    description: 'Pricing, AI features, and which buyer each tool fits.',
    images: ['/api/og?title=BizPlan+Genius+vs+Bizplan.com&subtitle=Honest+2026+comparison&badge=Compare'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'BizPlan Genius - Business Plan Pro',
          description: 'AI-generated investor-ready business plan with 9 sections, 3-year financials, real competitor research.',
          url: `${SITE.url}/generate?tier=pro`,
          price: PRICING.planPro,
        }),
        productSchema({
          name: 'Bizplan.com',
          description: 'Subscription business planning tool from Startups.com with template-driven section flow and dragdrop builder.',
          url: 'https://www.bizplan.com/',
          price: '29.00',
          brand: 'Startups.com',
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/compare' },
          { name: 'BizPlan Genius vs Bizplan.com', url: '/compare/bizplangenius-vs-bizplan-com' },
        ]),
        faqSchema([
          { question: 'How is BizPlan Genius different from Bizplan.com?', answer: 'BizPlan Genius is a one-time $97 to $147 purchase that generates the full plan from a single brief, with real competitor data via Google Search grounding. Bizplan.com is a subscription template-builder bundled with Startups.com community access.' },
          { question: 'Which is cheaper over 12 months?', answer: 'BizPlan Genius. $97 to $147 one-time vs Bizplan.com at $29 per month, which is $348 over 12 months.' },
          { question: 'Does Bizplan.com use AI?', answer: 'Bizplan.com added AI text suggestions in 2024 but does not perform live competitor research. The core flow is template-driven section-by-section.' },
          { question: 'Which tool is better for SBA loans?', answer: 'BizPlan Genius has a dedicated SBA-loan format with use-of-funds tables and debt-service-coverage calculations. Bizplan.com produces a generic plan that you would need to reformat for SBA submission.' },
        ]),
      ]} />
      {children}
    </>
  );
}
