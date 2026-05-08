import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import { breadcrumbSchema, faqSchema, howToSchema, SITE } from '@/lib/schemas';

const URL = `${SITE.url}/guides/investor-ready-business-plan-2026`;

export const metadata: Metadata = {
  alternates: { canonical: '/guides/investor-ready-business-plan-2026' },
  title: 'Investor-Ready Business Plan: 2026 Guide (12-Section Framework, Real Numbers, Rejection Reasons)',
  description:
    'How investors actually read business plans in 2026. The 12-section framework, financial model basics, common rejection reasons, and real examples. 25-minute read.',
  openGraph: {
    title: 'Investor-Ready Business Plan: The 2026 Guide',
    description:
      'How investors actually read plans in 2026. 12-section framework, financial model basics, real rejection reasons.',
    url: URL,
    siteName: SITE.name,
    type: 'article',
    images: [{ url: '/api/og?title=Investor-Ready+Business+Plan%3A+The+2026+Guide&subtitle=12-section+framework%2C+financials%2C+real+rejection+reasons.&badge=Pillar+Guide', width: 1200, height: 630, alt: 'Investor-Ready Business Plan 2026 Guide' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investor-Ready Business Plan: The 2026 Guide',
    description: 'The 12-section framework investors actually read, with real rejection reasons.',
    images: ['/api/og?title=Investor-Ready+Business+Plan%3A+The+2026+Guide&subtitle=12-section+framework%2C+financials%2C+real+rejection+reasons.&badge=Pillar+Guide'],
  },
};

const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Investor-Ready Business Plan: The 2026 Guide',
  description:
    'How investors actually read business plans in 2026. The 12-section framework, financial model basics, common rejection reasons, and real examples.',
  url: URL,
  author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  publisher: {
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: `${SITE.url}/api/og` },
  },
  datePublished: '2026-05-08',
  dateModified: '2026-05-08',
  image: `${SITE.url}/api/og`,
  mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        article,
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: 'Investor-Ready Business Plan 2026', url: '/guides/investor-ready-business-plan-2026' },
        ]),
        howToSchema({
          name: 'How to Write an Investor-Ready Business Plan',
          description: 'Step-by-step process to produce a business plan that pre-seed and seed investors will actually read end to end.',
          totalTime: 'PT8H',
          steps: [
            { name: 'Open with a one-page executive summary', text: 'Lead with the problem, the solution, the market size, and the ask. Investors scan this in 60 seconds and decide whether to read on.' },
            { name: 'Quantify the problem with real numbers', text: 'Pull data from BLS, Statista, IBISWorld, or industry reports. Cite the source and the year. Skip vague terms like huge market.' },
            { name: 'Describe your solution in plain language', text: 'Cut jargon. If your mother cannot explain it back to you, rewrite it.' },
            { name: 'Size the market with TAM/SAM/SOM', text: 'TAM is the total addressable market. SAM is the serviceable available market. SOM is the share you can realistically capture in 36 months. Show the math.' },
            { name: 'Map the competitive landscape', text: 'List 10 to 15 real competitors. For each, capture pricing, positioning, and one specific weakness you can attack.' },
            { name: 'Build a 36-month financial model', text: 'Three years of monthly P&L, cash flow, and balance sheet. Each line item must trace back to a unit assumption you can defend.' },
            { name: 'State your ask and use of funds', text: 'How much, what equity or terms, and what specific milestones the round buys you. Investors hate vague use-of-funds breakdowns.' },
            { name: 'Stress-test for rejection reasons', text: 'Read the plan as if you are a tired partner at 9pm. Cut anything that is unverifiable, generic, or contradicts another section.' },
          ],
        }),
        faqSchema([
          { question: 'How long should an investor-ready business plan be?', answer: '20 to 35 pages plus a financial appendix. Pre-seed plans skew shorter, late-seed and Series A plans run longer because the financial model carries more weight.' },
          { question: 'What is the most common reason investors reject a plan?', answer: 'Financial models that do not trace back to verifiable unit economics. Investors scan the model first, find an undefendable assumption (often customer acquisition cost or churn), and stop reading.' },
          { question: 'Do I need TAM, SAM, and SOM in 2026?', answer: 'Yes. The framing has not changed. What has changed is that investors expect bottom-up SOM math (price times customers per period) rather than top-down percentage-of-TAM hand-waving.' },
          { question: 'Should I include a SWOT analysis?', answer: 'Only if your weaknesses and threats sections name specific risks the investor would have asked about anyway. A generic SWOT signals you have not done the work.' },
          { question: 'What financial statements do investors actually read?', answer: 'Monthly P&L for 36 months, monthly cash flow for 36 months, and a 12-month balance sheet projection. Lenders also want a use-of-funds table and break-even analysis.' },
          { question: 'How fresh do market research citations need to be?', answer: 'Within 18 months for stable industries (food, professional services), within 6 months for fast-moving categories (AI, fintech). Older citations make the plan look stale.' },
        ]),
      ]} />
      {children}
    </>
  );
}
