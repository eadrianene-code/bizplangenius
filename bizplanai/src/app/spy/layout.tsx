import type { Metadata } from 'next';
import SchemaJsonLd from '@/app/components/SchemaJsonLd';
import UpsellModule from '@/app/components/UpsellModule';
import { productSchema, breadcrumbSchema, faqSchema, PRICING, SITE } from '@/lib/schemas';

export const metadata: Metadata = {
  alternates: { canonical: '/spy' },
  title: 'Competitor Spy - Find Their Weaknesses Before They Find Yours | BizPlan Genius',
  description: '10-15 real competitors analyzed in under 5 minutes. Pricing comparison, SWOT analysis, vulnerability audit, and 90-day tactical roadmap. $97 PDF, no subscription.',
  openGraph: {
    title: 'Competitor Spy - 10-15 Real Competitors, SWOT, Vulnerabilities, 90-Day Roadmap',
    description: '$97 one-time, no subscription. Competitor Spy delivers 10-15 real competitors with SWOT and a 90-day tactical roadmap.',
    url: `${SITE.url}/spy`,
    siteName: SITE.name,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Competitor Spy Report' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Competitor Spy - 10-15 Real Competitors Analyzed',
    description: '$97 one-time. SWOT, vulnerability audit, 90-day tactical roadmap.',
    images: ['/api/og'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaJsonLd data={[
        productSchema({
          name: 'Competitor Spy Report',
          description: 'AI-powered competitive analysis with 10-15 real competitors, pricing comparison, SWOT analysis, vulnerability audit, and 90-day tactical roadmap. PDF deliverable.',
          url: `${SITE.url}/spy`,
          price: PRICING.spy,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Competitor Spy', url: '/spy' },
        ]),
        faqSchema([
          {
            question: 'How many competitors does Competitor Spy analyze?',
            answer: '10 to 15 real competitors per report, sourced via Gemini 2.5 Flash with Google Search grounding so the data reflects what is actually online.',
          },
          {
            question: 'Is Competitor Spy a subscription?',
            answer: 'No. Competitor Spy is a one-time $97 purchase that delivers a PDF report. Optional Competitor Monitoring at $15/mo adds quarterly refreshes and change-detection alerts.',
          },
          {
            question: 'How long does the report take?',
            answer: 'Most reports complete in under 5 minutes from the moment you describe your business.',
          },
          {
            question: 'What is in the report?',
            answer: 'Top 10 to 15 competitors, pricing comparison, SWOT for each, vulnerability audit (where competitors are weakest), and a 90-day tactical roadmap of moves you can make.',
          },
        ]),
      ]} />
      {children}
      <UpsellModule />
    </>
  );
}
