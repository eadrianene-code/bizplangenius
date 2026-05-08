import UpsellModule from '@/app/components/UpsellModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SBA Loan Business Plan: Lender-Ready in 10 Minutes for $147 | BizPlan Genius',
  description:
    'Generate a complete SBA 7(a), 504, or microloan business plan with 3 to 5-year financial projections, market analysis, and use of funds. Lender-ready format in 10 minutes. $147 one-time, money-back guarantee.',
  keywords:
    'SBA loan business plan, SBA business plan template, SBA 7a business plan, SBA 504 business plan, business plan for SBA loan, SBA business plan example, business plan for bank loan, lender ready business plan, SBA loan application business plan',
  alternates: {
    canonical: '/sba-loan-business-plan',
  },
  openGraph: {
    title: 'SBA Loan Business Plan: Lender-Ready in 10 Minutes',
    description:
      'Complete SBA 7(a), 504, or microloan business plan with 5-year financials and use of funds. Cheaper than a consultant. Money-back guarantee.',
    url: 'https://www.bizplangenius.com/sba-loan-business-plan',
    siteName: 'BizPlan Genius',
    type: 'website',
    images: [
      {
        url: '/api/og?title=SBA+Loan+Business+Plan&subtitle=Lender-ready+plan+with+5-year+financials.+%24147+one-time.+Money-back+guarantee.&badge=SBA+Plan',
        width: 1200,
        height: 630,
        alt: 'BizPlan Genius - SBA Loan Business Plan for $147',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SBA Loan Business Plan in 10 Minutes - $147',
    description: 'Lender-ready plan with 5-year financials. Money-back guarantee.',
    images: ['/api/og?title=SBA+Loan+Business+Plan&subtitle=Lender-ready+plan+with+5-year+financials.+%24147+one-time.&badge=SBA+Plan'],
  },
};

export default function SbaLoanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'SBA Loan Business Plan',
            description:
              'AI-generated SBA loan business plan with 5-year financial projections, market analysis, and use of funds. Designed to meet typical SBA lender expectations.',
            url: 'https://www.bizplangenius.com/sba-loan-business-plan',
            brand: { '@type': 'Brand', name: 'BizPlan Genius' },
            image: 'https://www.bizplangenius.com/api/og',
            category: 'Business documentation',
            sku: 'sba-loan-business-plan',
            offers: {
              '@type': 'Offer',
              price: '147.00',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              priceValidUntil: '2026-12-31',
              url: 'https://www.bizplangenius.com/sba-loan-business-plan',
              seller: { '@type': 'Organization', name: 'BizPlan Genius' },
              hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'US',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                merchantReturnDays: 14,
                returnMethod: 'https://schema.org/ReturnByMail',
                returnFees: 'https://schema.org/FreeReturn',
              },
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Will an SBA lender accept this business plan?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our plan follows the standard structure SBA lenders expect: executive summary, market analysis, management and operations, marketing strategy, and 3 to 5-year financial projections including income statement, cash flow, and balance sheet. Approval depends on your credit, collateral, business viability, and lender criteria, not on the plan format alone.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does this work for SBA 7(a) and 504 loans?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Our Pro plan covers the requirements typical lenders ask for under SBA 7(a), 504, and SBA microloan applications. It also includes a use of funds breakdown and a debt service coverage ratio context section.',
                },
              },
              {
                '@type': 'Question',
                name: 'How long is the plan?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Typically 30 to 50 pages including financials. Most SBA lenders prefer concise, well-structured plans rather than 100-page documents.',
                },
              },
              {
                '@type': 'Question',
                name: 'How is this different from a $1,500 to $3,000 SBA business plan writer?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Specialty SBA plan writers charge $1,500 to $3,000 and take one to three weeks. We deliver a professionally structured plan in under 10 minutes for $147. For complex multi-property real estate or franchise stack deals, a specialist may still help. For most standalone small business loans, our plan is enough.',
                },
              },
              {
                '@type': 'Question',
                name: 'What if my lender does not accept the plan?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Pro plan includes a 100% money-back guarantee. If your lender returns the plan as inadequate, request a refund within 14 days.',
                },
              },
            ],
          }),
        }}
      />
      {children}
      <UpsellModule />
    </>
  );
}
