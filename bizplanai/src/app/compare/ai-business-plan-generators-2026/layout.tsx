import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema, productSchema, faqSchema, SITE, PRICING } from '@/lib/schemas';

const URL = `${SITE.url}/compare/ai-business-plan-generators-2026`;

export const metadata: Metadata = {
  alternates: { canonical: '/compare/ai-business-plan-generators-2026' },
  title: 'Best AI Business Plan Generators (2026): Honest Roundup',
  description: '7 AI business plan generators compared by price, real-data sourcing, format, and which buyer they fit. Updated May 2026.',
  openGraph: {
    title: 'Best AI Business Plan Generators (2026)',
    description: 'Pricing, real-data sourcing, format, and which buyer each tool fits best.',
    url: URL,
    siteName: SITE.name,
    type: 'article',
    images: [{ url: '/api/og?title=AI+Business+Plan+Generators+2026&subtitle=Honest+roundup%2C+ranked&badge=Compare', width: 1200, height: 630, alt: 'AI business plan generators 2026 roundup' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best AI Business Plan Generators (2026)',
    description: 'Honest roundup, ranked by price, real-data, and buyer fit.',
    images: ['/api/og?title=AI+Business+Plan+Generators+2026&subtitle=Honest+roundup%2C+ranked&badge=Compare'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'BizPlan Genius - Business Plan Pro',
          description: 'AI-generated investor-ready business plan with real competitor research and 3-year financials.',
          url: `${SITE.url}/generate?tier=pro`,
          price: PRICING.planPro,
        }),
        productSchema({
          name: 'LivePlan',
          description: 'Subscription business planning software with templates and forecasting.',
          url: 'https://www.liveplan.com/',
          price: '20.00',
          brand: 'Palo Alto Software',
        }),
        productSchema({
          name: 'Bizplan.com',
          description: 'Subscription template builder from Startups.com.',
          url: 'https://www.bizplan.com/',
          price: '29.00',
          brand: 'Startups.com',
        }),
        productSchema({
          name: 'Upmetrics',
          description: 'AI-assisted business plan platform with subscription pricing.',
          url: 'https://upmetrics.co/',
          price: '9.00',
          brand: 'Upmetrics',
        }),
        productSchema({
          name: 'Enloop',
          description: 'Business plan software with auto-write functionality and pass/fail scoring.',
          url: 'https://enloop.com/',
          price: '11.00',
          brand: 'Enloop',
        }),
        productSchema({
          name: '15MinutePlan.AI',
          description: 'Quick AI plan generator focused on a 15-minute turnaround.',
          url: 'https://15minuteplan.ai/',
          price: '49.00',
        }),
        productSchema({
          name: 'ChatGPT Plus (general-purpose AI)',
          description: 'General-purpose LLM that can draft a business plan from a custom prompt.',
          url: 'https://chat.openai.com/',
          price: '20.00',
          brand: 'OpenAI',
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/compare' },
          { name: 'AI Business Plan Generators 2026', url: '/compare/ai-business-plan-generators-2026' },
        ]),
        faqSchema([
          { question: 'What is the best AI business plan generator in 2026?', answer: 'There is no single best. The right tool depends on whether you need a one-time plan with real competitor data (BizPlan Genius), ongoing template iteration (LivePlan, Bizplan.com), the cheapest entry (Upmetrics, Enloop), or maximum flexibility with a general LLM (ChatGPT Plus).' },
          { question: 'Can ChatGPT alone produce a usable business plan?', answer: 'ChatGPT can produce a draft, but it cannot pull real competitor pricing, will hallucinate market sizes, and produces output that investors increasingly recognize and discount. It is the cheapest option but the highest editorial overhead.' },
          { question: 'Do AI plan generators work for SBA loans or visa applications?', answer: 'Most do not. SBA and visa applications require specific formats (use-of-funds tables for SBA, 5-year projections plus job-creation for E-2). BizPlan Genius is the only tool in this roundup that produces those formats out of the box.' },
          { question: 'Which generator gives real competitor data?', answer: 'BizPlan Genius uses Gemini 2.5 Flash with Google Search grounding to pull live competitor data. The other tools either use industry benchmarks (LivePlan, Bizplan.com), require manual competitor entry, or hallucinate (general LLMs).' },
          { question: 'Is a one-time payment or subscription better?', answer: 'For a single launch, one-time. For ongoing iteration over 12 months or more, the subscription tools end up cheaper if you use them weekly. Most founders launch once.' },
        ]),
      ]} />
      {children}
    </>
  );
}
